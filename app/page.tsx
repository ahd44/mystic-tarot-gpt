'use client';

import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { readers, Reader } from "@/lib/readers";
import { StreamingTextResponse } from "ai";
import Image from "next/image";
import Link from "next/link";

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

  return <div id="reader_choices" className={(phase === Phase.ChooseReader ? "visible opacity-100 " : "hidden opacity-0 ") + "flex w-full justify-around p-2 flex-wrap transition-all"}>
    {readers.map(function (x, i) {
      return <div className="bg-white p-2 rounded-lg bg-opacity-50 w-2/5 text-center my-2 select-none cursor-pointer" onClick={() => { setReader(x); nextPhase() }} key={"reader" + i}>
        <h3 className="text-lg font-bold">{x.name}</h3>
        <div className="h-[150px] w-[150px] relative block m-auto">
          <Image src={"/img/reader/" + x.name + ".png"} alt={x.alt} fill={true} sizes="150px" />
        </div>
        <div>{x.desc}</div>
      </div>;
    })}
  </div>
}

// now unused -- choose a spread; since we are only doing Celtic Cross now, this is left in case of future expansion
function SpreadChoices({ setSpread, nextPhase, phase }: { setSpread: Dispatch<SetStateAction<Spread>>, nextPhase: Function, phase: Phase }) {

  return <div id="spread_choices" className={(phase === Phase.ChooseSpread ? "visible opacity-100 " : "hidden opacity-0 ") + "flex w-full justify-around p-2 flex-wrap transition-all"}>
    <div className="bg-white p-2 rounded-lg bg-opacity-50 w-4/5 text-center my-2 select-none cursor-pointer" onClick={() => { setSpread(Spread.CelticCross); nextPhase() }}>
      <h3 className="text-lg font-bold">Celtic Cross</h3>
      <div>A 10-card spread used to investigate specific questions -- for example, &quot;Should I eat an apple or a banana?&quot;</div>
    </div>
  </div>
}

function TextAreaInput({ id, phase, visiblePhase, nextPhase }: { id: string, phase: Phase, visiblePhase: Phase, nextPhase: Function }) {

  return <div className={(phase === visiblePhase ? "visible opacity-100 " : "hidden opacity-0 ") + "w-full p-2 transition-all"}>
    <h3 className="text-lg font-bold text-slate-200">{phase === Phase.ProvideBiography ? "Personal Information" : "Question"}</h3>
    <textarea id={id} className="block mb-2 w-full h-40 p-2">
    </textarea>
    <button type="button" onClick={nextPhase as MouseEventHandler<HTMLButtonElement>} className="bg-white p-2 rounded">
      And that&apos;s all there is to say
    </button>
  </div >;
}

function TarotCard({ name, cardIndex, currentIndex }: { name?: string, cardIndex: number, currentIndex: number }) {

  // TODO determine rotation/position based on index
  let width = 56, height = 106;
  let topOffset = "0";
  let leftOffset = "0";

  let rotate = "0";

  let positioningClasses = "";
  let hoverClasses = "";
  switch (cardIndex) {
    case 0:
      positioningClasses = "top-[38%] left-[20%]";
      hoverClasses = "hover:top-[calc(38%-53px)] hover:left-[calc(20%-28px)]";
      break;
    case 1:
      positioningClasses = "top-[38%] left-[20%] rotate-90";
      hoverClasses = "hover:top-[calc(38%-53px)] hover:left-[calc(20%-28px)]";
      break;
    case 2:
      positioningClasses = "bottom-[8%] left-[20%]";
      hoverClasses = "hover:bottom-[calc(8%-0px)] hover:left-[calc(20%-28px)]";
      break;
    case 3:
      positioningClasses = "top-[38%] left-[4%]";
      hoverClasses = "hover:top-[calc(38%-53px)] hover:left-[calc(4%-28px)]";
      break;
    case 4:
      positioningClasses = "top-[8%] left-[20%]";
      hoverClasses = "hover:top-[calc(8%-53px)] hover:left-[calc(20%-28px)]";
      break;
    case 5:
      positioningClasses = "top-[38%] left-[36%]";
      hoverClasses = "hover:top-[calc(38%-53px)] hover:left-[calc(36%-28px)]";
      break;
    case 6:
      positioningClasses = "bottom-[2%] left-[60%]";
      hoverClasses = "hover:bottom-[calc(2%-0px)] hover:left-[calc(60%-28px)]";
      break;
    case 7:
      positioningClasses = "bottom-[27%] left-[72%]";
      hoverClasses = "hover:bottom-[calc(27%-53px)] hover:left-[calc(72%-28px)]";
      break;
    case 8:
      positioningClasses = "top-[27%] left-[60%]";
      hoverClasses = "hover:top-[calc(27%-53px)] hover:left-[calc(60%-28px)]";
      break;
    case 9:
      positioningClasses = "top-[2%] left-[72%]";
      hoverClasses = "hover:top-[calc(2%-53px)] hover:left-[calc(72%-28px)]";
      break;

  }

  const img = name && (typeof name) === 'string' ? <Image alt={name} src={"/img/card/" + name.replaceAll(" ", "") + ".jpg"} fill={true} sizes="104px" /> : <></>
  return <>
    <div className={"h-[106px] w-[56px] border-slate-400 border border-dashed rounded absolute z-0 " + positioningClasses}></div>
    <div className={"h-[106px] w-[56px] group text-xxs border-white border-2 rounded bg-slate-300 absolute z-10 transition-all" + (cardIndex <= currentIndex ? " visible opacity-100" : " hidden opacity-0") +
      " hover:h-[212px] hover:w-[112px] hover:z-20 hover:border-4 transition-all " + positioningClasses + " " + hoverClasses}>
      <div className={"block h-full"}>
        <div className="h-[86px] w-[52px] group-hover:h-[172px] group-hover:w-[104px] relative transition-all">
          {img}
        </div>
        <span className="block text-center text-xxs group-hover:text-base group-hover:leading-4 w-full transition-all">{name}</span>
      </div>
    </div>
  </>;
}

export default function Home() {
  // State variables
  const [reader, setReader] = useState<Reader>(readers[0]);
  //const [spread, setSpread] = useState<Spread>(Spread.CelticCross); // currently only one spread is implemented, but more could be added in the future
  const [phase, setPhase] = useState<Phase>(Phase.Initial);
  const [cards, setCards] = useState<Array<string>>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [readingIndex, setReadingIndex] = useState<number>(0);
  const [streamFinished, setStreamFinished] = useState<boolean>(false);

  const tarotDeck = [
    "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World", "The Fool",
    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
    "Ace of Coins", "Two of Coins", "Three of Coins", "Four of Coins", "Five of Coins", "Six of Coins", "Seven of Coins", "Eight of Coins", "Nine of Coins", "Ten of Coins", "Page of Coins", "Knight of Coins", "Queen of Coins", "King of Coins",
  ];

  async function loadReading(bio: string, question: string) {
    console.log("attempting reading");
    const response = (await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bio: bio, question: question, cards, reader }
      ),
    })) as StreamingTextResponse;

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) return;
    const streamReader = data.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await streamReader.read();
      const textVal = decoder.decode(value);

      setAiResponse((s) => {
        return s + textVal;
      });
      if (done) {
        console.log("done");
        setStreamFinished(true);
        return;
      }
    }

  }

  function shuffleAndSelect(amt: number, exc?: string, prepend?: boolean) {
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
    if (exc && prepend) {
      array.unshift(exc);
    }
    return array.slice(0, (exc && prepend ? amt + 1 : amt));
  }

  let textOutput = <></>;
  let enableClickToProceed = false;
  let enableNavArrows = false;
  let continueText = "Click here to continue..."

  let navArrows = <></>

  switch (phase) {
    case Phase.Initial:
      textOutput = <>
        <h2 className="font-bold text-2xl">Welcome to Mystic TarotGPT</h2>
        <p className="my-4">
          Tarot readings are provided by an integration with ChatGPT and these readings are for entertainment purposes only.
        </p>
        <p className="my-4">
          Card images are from the Rider-Waite Tarot, illustrated by Pamela Colman Smith, and are in the public domain in most countries.
          Reader portraits are AI-generated, using Stable Diffusion.
        </p>
        <p className="my-4">
          Created by <Link href="https:/www.andrewdebevec.com/" className="underline text-sky-800">Andrew Debevec</Link>
        </p>
      </>;
      enableClickToProceed = true;
      break;
    case Phase.ChooseReader:
      textOutput = <>Who would you like to read your tarot cards?</>;
      break;
    case Phase.ProvideBiography:
      textOutput = <>Hmm, yes... please tell me a bit about yourself. Whatever you think is relevant will do...</>; //fallback
      if (reader.prompts) {
        textOutput = <>{reader.prompts.biographical}</>
      }
      break;
    case Phase.ChooseSpread:
      movePhase();
      // since only Celtic Cross is available, we are skipping this section, but it is left in case of future expansion
      /*
      textOutput = <>And what kind of reading would you like today?</>; //fallback
      if (reader.prompts) {
        textOutput = <>{reader.prompts.spread}</>
      }*/
      break;
    case Phase.ProvideQuestion:
      textOutput = <>My dear, what question are we looking to answer today?</> //fallback
      if (reader.prompts) {
        textOutput = <>{reader.prompts.question}</>
      }

      break;
    case Phase.WaitingForChatGPT:
      if (cards.length == 0) {
        // select 9 cards, plus "The Magician" as the significator
        setCards(shuffleAndSelect(9, "The Magician", true));
      } else if (!waiting) {
        console.log(cards);
        if (cards.length > 0) {
          setWaiting(true);
          loadReading((document.getElementById("biographical_info") as HTMLTextAreaElement)?.value ?? "",
            (document.getElementById("question_to_answer") as HTMLTextAreaElement)?.value ?? "");
        }
      } // otherwise we are waiting, so just wait
      textOutput = <>Waiting for the stars to align...</>
      if (aiResponse !== "") {
        movePhase();
      }
      break;
    case Phase.Reading:
      const aiResponseArray = aiResponse.split("\n\n");
      textOutput = <>{processAIResponse(aiResponseArray[readingIndex], readingIndex)}</>;
      if (aiResponseArray.length > readingIndex + 1 || streamFinished) {
        enableNavArrows = true;
        navArrows = <div className="flex justify-between">
          <div id="previousArrow" className={"p-2 bg-white text-xl select-none rounded" + (readingIndex > 0 ? " opacity-100 cursor-pointer" : " opacity-0")} onClick={() => { setReadingIndex((i) => (i - 1 >= 0 ? i - 1 : 0)) }}>&lt;&mdash;</div>
          {streamFinished && readingIndex === aiResponseArray.length - 1 ?
            <div id="summaryButton" className={"p-2 bg-white text-xl select-none cursor-pointer rounded"} onClick={() => { movePhase() }}>Summary</div>
            :
            <div id="nextArrow" className={"p-2 bg-white text-xl select-none rounded" + (readingIndex + 1 < aiResponseArray.length ? " opacity-100 cursor-pointer" : " opacity-0 ")} onClick={() => { setReadingIndex((i) => (i + 1 < aiResponseArray.length ? (i + 1) : i)) }}>&mdash;&gt;</div>
          }
        </div>
      }
      break;
    case Phase.Finished:
      const summary = aiResponse.split("\n\n").map((x, i) => (processAIResponse(x, i)));
      textOutput = <><h2 className="font-bold text-xl">Summary</h2> {summary}</>
      continueText = "Click here to start a new reading";
      enableClickToProceed = true;
      break;
  }

  const clickHereToContinue = <div className="italic text-center w-full text-lg p-4 cursor-pointer" onClick={movePhase}>{continueText}</div>;

  // process the AI response
  function processAIResponse(response: string, index: number) {
    let processedResponse = response.replaceAll(/[\n\:]+/g, "*****").split("*****").map(
      (x, i) => (i === 0 && index > 0 && index < 11 ?
        <strong key={'ai-response-strong-' + i}><span className="mb-4 block" key={'ai-response-' + i}>{x}</span></strong> :
        <span className="mb-4 block" key={'ai-response-' + i}>{x}</span>)
    );
    return processedResponse;
  }

  // reset state variables to perform a new reading, and empty text areas
  function resetState() {
    setCards([]);
    setAiResponse('');
    setWaiting(false);
    setReadingIndex(0);
    setStreamFinished(false);
    (document.getElementById("biographical_info") as HTMLTextAreaElement).value = '';
    (document.getElementById("question_to_answer") as HTMLTextAreaElement).value = '';
  }

  // move to the next phase; if finished, reset state and return to the initial phase
  function movePhase() {
    setPhase((p) => {
      if (p === Phase.Finished) {
        resetState();
        return Phase.Initial;
      } else {
        return (p + 1) as Phase;
      }
    });
  }

  const tarotCardDisplay = new Array<React.ReactNode>();
  for (let i = 0; i < 10; i++) {
    tarotCardDisplay.push(<TarotCard name={cards[i]} cardIndex={i} currentIndex={readingIndex - 1} key={"tc-" + i} />);
  }

  return (
    <main
      id="content"
      className="bg-slate-900 min-h-screen w-full text-black p-4 grid-cols-1 grid-rows-2 grid gap-2 "
    >
      <div id="top_display" className="h-[47vh]"
      >
        <div id="text_output" className="bg-white p-2 h-full overflow-y-auto rounded-lg bg-opacity-50 mb-10">
          {
            phase > Phase.ChooseReader && reader ?
              <div className="h-[200px] w-[200px] float-left mr-2 mb-2 relative rounded">
                <Image src={"/img/reader/" + reader.name + ".png"} fill={true} alt={reader.alt} sizes="200px" className="rounded" />
              </div>
              : <></>
          }
          {textOutput}
          {enableClickToProceed ? clickHereToContinue : <></>}
          <div className="clear-both"></div>
          {enableNavArrows ? navArrows : <></>}
        </div>
      </div>
      <div id="bottom_display" className="bg-white bg-opacity-20 rounded">
        <div id="user_input">
          <ReaderChoices setReader={setReader} nextPhase={movePhase} phase={phase} />
          {/*<SpreadChoices setSpread={setSpread} nextPhase={movePhase} phase={phase} />*/}
          <TextAreaInput id="biographical_info" phase={phase} visiblePhase={Phase.ProvideBiography} nextPhase={movePhase} />
          <TextAreaInput id="question_to_answer" phase={phase} visiblePhase={Phase.ProvideQuestion} nextPhase={movePhase} />
        </div>
        <div
          id="tarot_cards"
          className={"w-full h-full block relative transition-all " +
            (phase >= Phase.Reading
              ? " visible opacity-100 "
              : " hidden opacity-0 ")
          }
        >
          <p className="text-slate-300 text-sm m-2 italic absolute">Tip: Hover over the cards to enlarge them!</p>
          {tarotCardDisplay}
        </div>
      </div>
    </main>
  );
}
