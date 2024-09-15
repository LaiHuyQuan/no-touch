import { useEffect, useRef } from "react";
import "./App.css";
import { Howl, howler } from "howler";
import * as tfjs from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import soundURL from "./assets/hey_sondn.mp3";

// var sound = new Howl({
//   src: [soundURL],
// });

// sound.play();

const NOT_TOUCH_LABEL = "not-touch";
const TOUCHED_LABEL = "touched";
const TRAINING_TIME = 50;

function App() {
  const video = useRef();
  const classifier = useRef();
  const mobilenetModule = useRef();

  const init = async () => {
    console.log("init...");
    await setupCamera();
    console.log("Setup camera success");

    classifier.current = knnClassifier.create();
    mobilenetModule.current = await mobilenet.load();

    console.log("setup done");
    console.log("no-touch and click Train 1");
  };

  const setupCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          (stream) => {
            video.current.srcObject = stream;
            video.current.addEventListener("loadeddata", resolve());
          },
          (error) => reject(error)
        );
      } else {
        reject();
      }
    });
  };

  const train = async (label) => {
    for (let i = 0; i < TRAINING_TIME; i++) {
      console.log(
        "progress " + parseInt(((i + 1) / TRAINING_TIME) * 100) + "%"
      );
      await training(label);
    }
  };

  const training = (label) => {
    return new Promise(async (resolve) => {
      const embedding = mobilenetModule.current.infer(video.current, true);
      classifier.current.addExample(embedding, label);
      await sleep(100);
      resolve();
    });
  };

  const run = async () => {
    const embedding = mobilenetModule.current.infer(video.current, true);
    const result = classifier.current.predictClass(embedding);

    console.log("Lable: ", result.label);
    console.log("Lable: ", result.confidences);

    await sleep(200);

    run();
  };

  const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    init();

    return () => {};
  }, []);
  return (
    <div className="main">
      <video ref={video} className="video" autoPlay />

      <div className="control">
        <button
          className="btn"
          onClick={() => {
            train(NOT_TOUCH_LABEL);
          }}
        >
          Train 1
        </button>
        <button
          className="btn"
          onClick={() => {
            train(TOUCHED_LABEL);
          }}
        >
          Train 2
        </button>
        <button
          className="btn"
          onClick={() => {
            run();
          }}
        >
          Run
        </button>
      </div>
    </div>
  );
}

export default App;
