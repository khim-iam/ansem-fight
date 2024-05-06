import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import ansem from "../assets/start.png";
import ansemPunch from "../assets/idlee.png";
import t1ansemPunch from "../assets/T1-Ansem-Punch2.png";
import t2ansemPunch from "../assets/Tier_22.png";
import t3ansemPunch from "../assets/t33.png";
import upansemPunch from "../assets/uppercut.png";
import winImage from "../assets/win.png";
import loseImage from "../assets/lose.png";
import punchSound from "../assets/punch1.m4a";
import winSound from "../assets/win.m4a";
import loseSound from "../assets/lose.m4a";
import bellSound from "../assets/bell.m4a";
import t3Sound from "../assets/tier3powerup1.m4a";
import bgSound from "../assets/background.mp3";
import "./Homepage.css";
import opponent_t1 from "../assets/cook_punch_t1.png";
import opponent_t2 from "../assets/cook_punch_t2.png";
import cook_doge_1 from "../assets/doge_1_rev.png";
import cook_doge_2 from "../assets/doge_2_rev.png";
import ansem_doge_1 from "../assets/doge_1.png";
import ansem_doge_2 from "../assets/doge_2.png";
import loseImage_cook from "../assets/lose_cook.png";
import winImage_cook from "../assets/win_cook.png";
import cook_t3_pwrup from "../assets/t33_rev.png";
import t3_cook_win from "../assets/t3_cook_win.png";














const SoundTypes = {
  PUNCH: "punch",
  WIN: "win",
  LOSE: "lose",
  BELL: "bell",
  TIER3: "t3",
};
const dogeProbs = {
  t1: 0.4,
  t2: 0.3,
  t3: 0.2,
};
const imageSets = {
  ansem_t1: [ansemPunch, t1ansemPunch],
  ansem_t2: [ansemPunch, t1ansemPunch, t2ansemPunch],
  ansem_t3: [ansemPunch, t3ansemPunch, upansemPunch],
  cook_t1: [ansemPunch, opponent_t1],
  cook_t2: [ansemPunch, opponent_t1, opponent_t2],
  cook_t3: [ansemPunch, cook_t3_pwrup, t3_cook_win],
  cook_doge_1: [ansemPunch, cook_doge_1, cook_doge_1, cook_doge_1, cook_doge_1, cook_doge_1, t1ansemPunch],
  cook_doge_2: [ansemPunch, cook_doge_2, cook_doge_2, cook_doge_2, cook_doge_2, cook_doge_2, t2ansemPunch],
  ansem_doge_1: [ansemPunch, ansem_doge_1, ansem_doge_1, ansem_doge_1, ansem_doge_1, ansem_doge_1, opponent_t1],
  ansem_doge_2: [ansemPunch, ansem_doge_2, ansem_doge_2, ansem_doge_2, ansem_doge_2, ansem_doge_2, opponent_t2],
  default: [ansem, ansemPunch, t1ansemPunch],
  result_ansem: [loseImage, winImage],
  result_cook: [loseImage_cook, t3_cook_win],
};

const sounds = {
  [SoundTypes.PUNCH]: punchSound,
  [SoundTypes.WIN]: winSound,
  [SoundTypes.LOSE]: loseSound,
  [SoundTypes.BELL]: bellSound,
  [SoundTypes.TIER3]: t3Sound,
  background: bgSound,
};

//cp this
const PunchesConfig = [
  {
    minPunches: 1,
    maxPunches: 15,
    imageArr_p1: imageSets.ansem_t1,
    imageArr_p2: imageSets.cook_t1,
  },
  {
    minPunches: 16,
    maxPunches: 50,
    imageArr_p1: imageSets.ansem_t2,
    imageArr_p2: imageSets.cook_t2,
  },
  {
    minPunches: 35,
    maxPunches: 50,
    imageArr_p1: imageSets.ansem_t3,
    imageArr_p2: imageSets.cook_t3,
  },
];
const SPEED = 2;

export {SoundTypes, dogeProbs, imageSets, sounds, PunchesConfig, SPEED};