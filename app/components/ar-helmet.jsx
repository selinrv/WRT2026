import * as React from "react";

/**
 * Face-tracked welding helmet filter.
 *
 * AR.js itself only does marker / image / location tracking — it has no face
 * tracking — so the face anchoring here comes from MindAR (same A-Frame based
 * family of libraries). Both scripts are pulled from a CDN on demand, so
 * nothing is downloaded until the visitor actually asks for the camera.
 */

const AFRAME_SRC = "https://aframe.io/releases/1.5.0/aframe.min.js";
const MINDAR_SRC = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-face-aframe.prod.js";

// Anchor 168 is the bridge of the nose, between the eyes — the origin the helmet
// is built around. MindAR normalises that anchor space, so one unit in it is
// ~15.2 cm of real head (measured live off landmarks 234/454, whose spacing on
// the MediaPipe canonical head is 15.33 cm). Everything in buildHelmet() is
// written in centimetres and converted with CM, which is far easier to reason
// about than raw anchor units.
const ANCHOR_INDEX = 168;
const CM = 1 / 15.2;

const COLORS = {
  shell: "#2b3040",   // helmet body
  hood: "#171b26",    // lens housing
  lens: "#0b1a16",    // welding glass
  trim: "#4E6EF1",    // WRT2026 blue
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-ar-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(src)), { once: true });
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.arSrc = src;
    el.addEventListener("load", () => {
      el.dataset.loaded = "true";
      resolve();
    }, { once: true });
    el.addEventListener("error", () => {
      el.remove();
      reject(new Error(src));
    }, { once: true });
    document.head.appendChild(el);
  });
}

/** Builds the helmet out of primitives, so the page needs no 3D asset file. */
function buildHelmet(THREE) {
  const group = new THREE.Group();

  const material = (color, roughness, metalness) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, side: THREE.DoubleSide });

  const shellMat = material(COLORS.shell, 0.5, 0.35);
  const hoodMat = material(COLORS.hood, 0.65, 0.25);
  const trimMat = material(COLORS.trim, 0.35, 0.5);
  const lensMat = material(COLORS.lens, 0.12, 0.85);
  lensMat.emissive = new THREE.Color("#04120f");

  // The head sits at roughly (0, -4.5, -7) from the nose bridge. The shell is a
  // tapered band wrapped around it, left open at the back so it slips over the
  // head; everything else is placed just proud of that band.
  const SHELL = { z: -7, top: 9.5, bottom: -14.5, rTop: 9.8, rBottom: 11.4 };
  const ARC_START = -2.6;
  const ARC_LENGTH = 5.2; // ~298°, opening at the back
  const radiusAt = (y) =>
    SHELL.rTop + (SHELL.rBottom - SHELL.rTop) * ((SHELL.top - y) / (SHELL.top - SHELL.bottom));

  /** Curved panel hugging the shell: centred on the face, `lift` cm above it. */
  const panel = (top, bottom, halfAngle, lift, mat) => {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        radiusAt(top) + lift,
        radiusAt(bottom) + lift,
        top - bottom,
        48, 1, true,
        -halfAngle, halfAngle * 2
      ),
      mat
    );
    mesh.position.set(0, (top + bottom) / 2, SHELL.z);
    return mesh;
  };

  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(
      SHELL.rTop, SHELL.rBottom, SHELL.top - SHELL.bottom, 48, 1, true, ARC_START, ARC_LENGTH
    ),
    shellMat
  );
  shell.position.set(0, (SHELL.top + SHELL.bottom) / 2, SHELL.z);
  group.add(shell);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(SHELL.rTop, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    shellMat
  );
  crown.position.set(0, SHELL.top, SHELL.z);
  crown.scale.set(1, 0.42, 1);
  group.add(crown);

  // Flared skirt over the chin and collar.
  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(SHELL.rBottom, SHELL.rBottom + 1.2, 3.5, 48, 1, true, ARC_START, ARC_LENGTH),
    shellMat
  );
  skirt.position.set(0, SHELL.bottom - 1.75, SHELL.z);
  group.add(skirt);

  // Lens housing and welding glass, centred on the eye line (y = -2.6).
  group.add(panel(3.5, -8.7, 0.62, 0.15, hoodMat));   // raised frame
  group.add(panel(2.2, -7.4, 0.525, 0.3, lensMat));   // ~12 x 10 cm glass
  group.add(panel(8.2, 5.8, 1.9, 0.08, trimMat));     // brow band in conference blue

  group.scale.setScalar(CM);
  return group;
}

function registerHelmetComponent(AFRAME) {
  if (AFRAME.components["welding-helmet"]) return;
  AFRAME.registerComponent("welding-helmet", {
    init() {
      this.el.setObject3D("mesh", buildHelmet(AFRAME.THREE));
    },
    remove() {
      this.el.removeObject3D("mesh");
    },
  });
}

/** Asks for the camera first, so we can report why it failed before loading ~3.5 MB of AR libraries. */
async function preflightCamera() {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return "This browser does not support camera access. Try Chrome, Safari or Firefox.";
  }
  if (!window.isSecureContext) {
    return "The camera only works over HTTPS. Open this page at https://wrt2026.com.ua/ar.";
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    stream.getTracks().forEach((track) => track.stop());
    return null;
  } catch (error) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "Camera access was blocked. Allow the camera for this site in your browser settings and try again.";
    }
    if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
      return "No camera was found on this device.";
    }
    if (error.name === "NotReadableError") {
      return "The camera is already in use by another app. Close it and try again.";
    }
    return "The camera could not be started. Please try again.";
  }
}

export default function ArHelmet() {
  const containerRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const helmetRef = React.useRef(null);

  const [status, setStatus] = React.useState("idle"); // idle | loading | running | error
  const [error, setError] = React.useState(null);
  const [faceFound, setFaceFound] = React.useState(false);
  const [size, setSize] = React.useState(1);
  const [lift, setLift] = React.useState(0);

  const teardown = React.useCallback(() => {
    const scene = sceneRef.current;
    sceneRef.current = null;
    helmetRef.current = null;
    if (!scene) return;
    try {
      scene.systems?.["mindar-face-system"]?.stop();
    } catch {
      // The system throws if it is stopped before the camera stream attached.
    }
    try {
      scene.renderer?.dispose();
    } catch {
      // Nothing to dispose if the scene never rendered.
    }
    scene.remove();
    if (containerRef.current) containerRef.current.innerHTML = "";
  }, []);

  React.useEffect(() => teardown, [teardown]);

  // Keep the sliders wired to the helmet's local transform. The anchor entity's
  // own matrix is driven by MindAR every frame, so the tuning lives on a child.
  React.useEffect(() => {
    if (!helmetRef.current) return;
    helmetRef.current.setAttribute("scale", `${size} ${size} ${size}`);
    helmetRef.current.setAttribute("position", `0 ${(lift * CM).toFixed(4)} 0`);
  }, [size, lift, status]);

  async function start() {
    setError(null);
    setStatus("loading");

    const cameraError = await preflightCamera();
    if (cameraError) {
      setError(cameraError);
      setStatus("error");
      return;
    }

    try {
      await loadScript(AFRAME_SRC);
      await loadScript(MINDAR_SRC);
    } catch {
      setError("Could not load the AR libraries. Check your connection and try again.");
      setStatus("error");
      return;
    }

    if (!containerRef.current) return;
    registerHelmetComponent(window.AFRAME);

    const scene = document.createElement("a-scene");
    scene.setAttribute("mindar-face", "autoStart: false; uiLoading: no; uiScanning: no; uiError: no");
    scene.setAttribute("embedded", "");
    scene.setAttribute("color-space", "sRGB");
    scene.setAttribute("renderer", "colorManagement: true; alpha: true");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("device-orientation-permission-ui", "enabled: false");
    scene.innerHTML = `
      <a-entity light="type: ambient; intensity: 1.4"></a-entity>
      <a-entity light="type: directional; intensity: 1.6" position="0.6 1 1.4"></a-entity>
      <a-entity light="type: directional; intensity: 0.6" position="-1 0.2 0.6"></a-entity>
      <a-camera active="false" position="0 0 0"></a-camera>
      <a-entity mindar-face-target="anchorIndex: ${ANCHOR_INDEX}">
        <a-entity id="ar-helmet" welding-helmet position="0 0 0" scale="1 1 1"></a-entity>
      </a-entity>
    `;

    scene.addEventListener("arReady", () => setStatus("running"));
    scene.addEventListener("arError", () => {
      setError("The camera could not be started. Please reload the page and try again.");
      setStatus("error");
      teardown();
    });
    scene.addEventListener("targetFound", () => setFaceFound(true));
    scene.addEventListener("targetLost", () => setFaceFound(false));
    scene.addEventListener("renderstart", () => {
      scene.systems["mindar-face-system"].start();
    }, { once: true });

    containerRef.current.appendChild(scene);
    sceneRef.current = scene;
    helmetRef.current = scene.querySelector("#ar-helmet");
  }

  function stop() {
    teardown();
    setFaceFound(false);
    setStatus("idle");
  }

  function switchCamera() {
    try {
      sceneRef.current?.systems?.["mindar-face-system"]?.switchCamera();
    } catch {
      setError("This device has only one camera.");
    }
  }

  /** Composites the camera frame and the rendered helmet into a downloadable PNG. */
  function takePhoto() {
    const container = containerRef.current;
    const scene = sceneRef.current;
    const video = container?.querySelector("video");
    const canvas = scene?.canvas;
    if (!video || !canvas) return;

    // MindAR sizes the video and the scene to cover the container, so both share
    // the same offset box; the video is CSS-mirrored, the WebGL canvas is not.
    const dpr = window.devicePixelRatio || 1;
    const out = document.createElement("canvas");
    out.width = container.clientWidth * dpr;
    out.height = container.clientHeight * dpr;
    const ctx = out.getContext("2d");

    const x = parseFloat(video.style.left || "0") * dpr;
    const y = parseFloat(video.style.top || "0") * dpr;
    const w = parseFloat(video.style.width || "0") * dpr;
    const h = parseFloat(video.style.height || "0") * dpr;

    ctx.save();
    ctx.translate(x + w / 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, -w / 2, y, w, h);
    ctx.restore();

    // A-Frame does not expose preserveDrawingBuffer, so the WebGL buffer is
    // already cleared by now; re-render and read it back in the same tick.
    scene.renderer.render(scene.object3D, scene.camera);
    ctx.drawImage(canvas, x, y, w, h);

    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "wrt2026-ar.png";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const busy = status === "loading";

  return (
    <div className="ar-helmet">
      <div className="ar-helmet__stage">
        <div className="ar-helmet__scene" ref={containerRef} />

        {status !== "running" && (
          <div className="ar-helmet__overlay">
            {status === "idle" && (
              <>
                <p>Put on a virtual welding helmet. Your camera stays on your device — nothing is uploaded.</p>
                <button type="button" className="main-btn btn-hover" onClick={start}>
                  Start camera
                </button>
              </>
            )}
            {busy && <p className="ar-helmet__pulse">Starting the camera and loading face tracking…</p>}
            {status === "error" && (
              <>
                <p className="ar-helmet__error">{error}</p>
                <button type="button" className="main-btn btn-hover" onClick={start}>
                  Try again
                </button>
              </>
            )}
          </div>
        )}

        {status === "running" && !faceFound && (
          <p className="ar-helmet__hint">Look at the camera and keep your whole face in frame.</p>
        )}
      </div>

      {status === "running" && (
        <div className="ar-helmet__controls">
          <div className="ar-helmet__buttons">
            <button type="button" className="main-btn btn-hover" onClick={takePhoto}>Take photo</button>
            <button type="button" className="ar-helmet__ghost" onClick={switchCamera}>Switch camera</button>
            <button type="button" className="ar-helmet__ghost" onClick={stop}>Stop camera</button>
          </div>
          <label className="ar-helmet__slider">
            <span>Helmet size</span>
            <input type="range" min="0.7" max="1.5" step="0.01" value={size}
                   onChange={(event) => setSize(Number(event.target.value))} />
          </label>
          <label className="ar-helmet__slider">
            <span>Fit up / down</span>
            <input type="range" min="-6" max="6" step="0.2" value={lift}
                   onChange={(event) => setLift(Number(event.target.value))} />
          </label>
        </div>
      )}

      <style>{`
        .ar-helmet { max-width: 560px; margin: 0 auto; }
        .ar-helmet__stage {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          max-height: 72vh;
          overflow: hidden;
          border-radius: 18px;
          background: #12152a;
          box-shadow: 0 20px 50px rgba(38, 41, 77, 0.25);
        }
        /* MindAR gives its <video> z-index: -2, so this element has to be its own
           stacking context or the feed sinks behind the stage background. */
        .ar-helmet__scene { position: absolute; inset: 0; overflow: hidden; z-index: 0; isolation: isolate; }
        .ar-helmet__overlay {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 18px; padding: 28px; text-align: center;
          background: linear-gradient(160deg, #26294d 0%, #12152a 100%);
        }
        .ar-helmet__overlay p { color: #d0d4da; margin: 0; max-width: 34ch; line-height: 1.6; }
        .ar-helmet__error { color: #ffb3a8 !important; }
        .ar-helmet__pulse { animation: ar-pulse 1.4s ease-in-out infinite; }
        @keyframes ar-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        .ar-helmet__hint {
          position: absolute; left: 0; right: 0; bottom: 16px; z-index: 3;
          margin: 0; padding: 10px 16px; text-align: center;
          color: #ffffff; font-size: 14px; background: rgba(18, 21, 42, 0.6);
        }
        .ar-helmet__controls { margin-top: 22px; }
        .ar-helmet__buttons { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .ar-helmet__ghost {
          border: 1px solid #bfc3cd; background: transparent; color: #282E63;
          border-radius: 6px; padding: 10px 20px; font-size: 15px; cursor: pointer;
        }
        .ar-helmet__ghost:hover { border-color: #4E6EF1; color: #4E6EF1; }
        .ar-helmet__slider { display: flex; align-items: center; gap: 14px; margin-top: 14px; }
        .ar-helmet__slider span { color: #505478; font-size: 14px; min-width: 110px; }
        .ar-helmet__slider input { flex: 1; accent-color: #4E6EF1; }
        @media (max-width: 480px) {
          .ar-helmet__buttons .main-btn, .ar-helmet__ghost { flex: 1 1 100%; }
        }
      `}</style>
    </div>
  );
}
