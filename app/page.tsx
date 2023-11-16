'use client';

import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { performReading } from "./actions";
import { readers, Reader } from "@/lib/readers";

enum Spread {
  CelticCross
}

enum Phase {
  Initial,
  ChooseReader,
  ProvideBiography,
  ChooseSpread,
  ProvideQuestion,
  WaitingForChatGPT,
  Reading,
  Finished,
}

function ReaderChoices({ setReader, nextPhase, phase }: { setReader: Dispatch<SetStateAction<Reader>>, nextPhase: Function, phase: Phase }) {

  return <div id="reader_choices" className={phase === Phase.ChooseReader ? "visible " : "hidden "}>
    {readers.map(function (x, i) {
      return <div onClick={() => { setReader(x); nextPhase() }} key={"reader" + i}>
        <h3>{x.name}</h3>
        <div>{x.desc}</div>
      </div>;
    })}
  </div>
}

function SpreadChoices({ setSpread, nextPhase, phase }: { setSpread: Dispatch<SetStateAction<Spread>>, nextPhase: Function, phase: Phase }) {

  return <div id="spread_choices" className={phase === Phase.ChooseSpread ? "visible " : "hidden "}>
    <div onClick={() => { setSpread(Spread.CelticCross); nextPhase() }}>
      <h3>Celtic Cross</h3>
      <div>A 9-card spread used to investigate specific questions -- for example, &quot;Should I eat an apple or a banana?&quot;</div>
    </div>
  </div>
}

function TextAreaInput({ id, phase, visiblePhase, nextPhase }: { id: string, phase: Phase, visiblePhase: Phase, nextPhase: Function }) {

  return <div className={phase === visiblePhase ? "visible " : "hidden "}>
    <textarea id={id}>
    </textarea>
    <button type="button" onClick={nextPhase as MouseEventHandler<HTMLButtonElement>}>
      And that&apos;s all there is to say
    </button>
  </div >;
}

export default function Home() {

  const [reader, setReader] = useState<Reader>(readers[0]);
  const [spread, setSpread] = useState<Spread>(Spread.CelticCross);
  const [phase, setPhase] = useState<Phase>(Phase.Initial);
  const [cards, setCards] = useState<Array<string>>([]);
  const [aiResponse, setAiResponse] = useState<string>();
  const [waiting, setWaiting] = useState<boolean>(false);

  const tarotDeck = [
    "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World", "The Fool",
    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
    "Ace of Coins", "Two of Coins", "Three of Coins", "Four of Coins", "Five of Coins", "Six of Coins", "Seven of Coins", "Eight of Coins", "Nine of Coins", "Ten of Coins", "Page of Coins", "Knight of Coins", "Queen of Coins", "King of Coins",
  ];

  async function loadReading(bio: string, question: string) {
    console.log("attempting reading");
    const completion = await performReading(bio, question, cards);
    console.log("done?");
    console.log(completion);
    setAiResponse(completion ?? "Error");
    movePhase();
  }

  async function testReading() {
    console.log("test reading");
    const completion = await performReading("I'm a 20 year old woman who loves to party.", "How can I find a job to afford feeding my kids?", shuffleAndSelect(9));
    console.log("end test");
    setAiResponse(completion ?? "Error");
    setPhase(Phase.Reading);

  }

  function shuffleAndSelect(amt: number, exc?: string) {
    let array = [...tarotDeck];
    if (exc) {
      array.splice(array.indexOf(exc), 1);
    }

    // Fisher-Yates algorithm

    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    // return only first amt elements
    return array.slice(0, amt);
  }

  let textOutput = <></>;
  let enableClickToProceed = false;

  const clickHereToContinue = <div>Click anywhere to continue...</div>;

  switch (phase) {
    case Phase.Initial:
      textOutput = (
        <>
          Welcome to TarotGPT...
        </>
      );
      enableClickToProceed = true;
      break;
    case Phase.ChooseReader:
      textOutput = <>Who would you like to read your tarot cards?</>;
      break;
    case Phase.ProvideBiography:
      textOutput = <>Hmm, yes... please tell me a bit about yourself. Whatever you think is relevant will do...</>
      break;
    case Phase.ChooseSpread:
      textOutput = <>And what kind of reading would you like today?</>
      break;
    case Phase.ProvideQuestion:
      textOutput = <>My dear, what question are we looking to answer today?</>
      break;
    case Phase.WaitingForChatGPT:
      if (cards.length == 0) {
        setCards(shuffleAndSelect(9, "The Magician"));
        console.log("shuffled and set cards");
      } else if (!waiting) {
        console.log("about to ask for reading");
        console.log(cards);
        if (cards.length > 0) {
          setWaiting(true);
          loadReading(document.getElementById("biographical_info")?.innerText ?? "",
            document.getElementById("question_to_answer")?.innerText ?? "");
        }
      } // otherwise we are waiting, so just wait
      textOutput = <>Waiting for the stars to align...</>
      break;
    case Phase.Reading:
      textOutput = <>{aiResponse}</>;
      console.log(aiResponse);
      break;
    case Phase.Finished:
      break;
  }

  function movePhase() {
    setPhase((p) => {
      if (p === Phase.Finished) {
        return Phase.Initial;
      } else {
        return (p + 1) as Phase;
      }
    });
  }

  return (
    <main
      id="content"
      onClick={enableClickToProceed ? movePhase : function () { }}
      className="bg-slate-900 min-h-screen w-full text-black p-4"
    >
      <button className="m-2 p-2 text-center w-1/2" type="button"
        onClick={testReading}>Test Reading</button>
      <div id="text_output" className="bg-white p-2 rounded-lg bg-opacity-50">
        {textOutput}
        {enableClickToProceed ? clickHereToContinue : <></>}
      </div>
      <div id="user_input">
        <ReaderChoices setReader={setReader} nextPhase={movePhase} phase={phase} />
        <TextAreaInput id="biographical_info" phase={phase} visiblePhase={Phase.ProvideBiography} nextPhase={movePhase} />
        <TextAreaInput id="question_to_answer" phase={phase} visiblePhase={Phase.ProvideQuestion} nextPhase={movePhase} />
        <SpreadChoices setSpread={setSpread} nextPhase={movePhase} phase={phase} />
      </div>
      <div
        id="tarot_cards"
        className={
          phase === Phase.Reading
            ? "visible "
            : "hidden " /* TODO fix in future */
        }
      >This is where tarot cards are displayed.</div>
    </main>
  );
}
