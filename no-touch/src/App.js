import "./App.css";
import { Howl, howler } from "howler";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import soundURL from "./assets/hey_sondn.mp3";

// var sound = new Howl({
//   src: [soundURL],
// });

// sound.play();

function App() {
  return (
    <div className="main">
      <video className="video" autoPlay />

      <div className="control">
        <button className="btn">Train 1</button>
        <button className="btn">Train 2</button>
        <button className="btn">Run</button>
      </div>
    </div>
  );
}

export default App;
