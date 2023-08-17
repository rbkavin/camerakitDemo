import {
  bootstrapCameraKit,
  CameraKitSession,
  createMediaStreamSource,
  Transform2D,
} from '@snap/camera-kit';

const liveRenderTarget = document.getElementById('canvas');
const flipCamera = document.getElementById('flip');
var canvas = document.querySelector('#canvas');
let isBackFacing = true;
let mediaStream;

async function init() {
  const cameraKit = await bootstrapCameraKit({
    apiToken: "< Apikey>"
  });

  const session = await cameraKit.createSession({
    liveRenderTarget
  });
  const lenses = await cameraKit.lensRepository.loadLens(
    "lens id"
  )

  session.applyLens(lenses);

  bindFlipCamera(session);
}

function bindFlipCamera(session) {
  flipCamera.style.cursor = 'pointer';

  flipCamera.addEventListener('click', () => {
    updateCamera(session);
  });

  updateCamera(session);
}

async function updateCamera(session) {
  isBackFacing = !isBackFacing;


  if (mediaStream) {
    session.pause();
    mediaStream.getVideoTracks()[0].stop();
  }

  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: isBackFacing ? 'environment' : 'user',

    },
  });


  const source = createMediaStreamSource(mediaStream, {
    // NOTE: This is important for world facing experiences
    cameraType: isBackFacing ? 'back' : 'front',
  });

  await session.setSource(source);
  source.setRenderSize(window.innerWidth, window.innerHeight)

  if (!isBackFacing) {
    source.setTransform(Transform2D.MirrorX);
  }

  session.play();
}

setTimeout(() => {
  init();
}, 200)