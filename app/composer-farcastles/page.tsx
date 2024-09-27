'use client'
import { useState } from 'react'
import { Button } from "~~/components/ui/button"
import { Card } from "~~/components/ui/card"
import { notification } from "~~/utils/scaffold-eth";
import { ask,generateImageSD, generateImage,generateImageGaia, imagePrompt } from '~~/apa/gaianet';

export default function Component() {
  const [attackReason, setAttackReason] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [selectedCrew, setSelectedCrew] = useState("random");
  const [selectedPick, setSelectedPick] = useState("random");
  const [pickedCastle, setPickedCastle] = useState("");
  const [pickedCrew, setPickedCrew] = useState("");
  const [loading, setLoading] = useState(false);
  
  const crews = [
    { value: "🏴‍☠️🐺", text: "🏴‍☠️🐺 “The Wolves”" },
    { value: "🏴‍☠️🦂", text: "🏴‍☠️🦂 “The Scorpions”" },
    { value: "🏴‍☠️🐉", text: "🏴‍☠️🐉 “The Dragons”" },
    { value: "🏴‍☠️🦁", text: "🏴‍☠️🦁 “The Lions”" },
    { value: "🏴‍☠️🐍", text: "🏴‍☠️🐍 “The Serpents”" },
    { value: "🏴‍☠️🐌", text: "🏴‍☠️🐌 “The Snails”" },
  ];
  const handleChange = (event: any) => {
    setSelectedCrew(event.target.value); // Update the state with the selected option's value
  };
  const handleChangePick = (event: any) => {
    setSelectedPick(event.target.value); // Update the state with the selected option's value
  };
  const generateAttackReason = (direction: string) => {
    const reasons = [
      "The enemy has weak defenses",
      "There's a secret passage",
      "Our spies reported valuable treasures",
      "It's the least expected direction",
      "We have superior siege weapons"
    ]
    setAttackReason(reasons[Math.floor(Math.random() * reasons.length)])
    // In a real app, you'd generate an image here
    setGeneratedImage('/placeholder.svg?height=200&width=400')
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8 flex flex-col items-center justify-center space-y-8"
      style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/0/0c/Rumeli_Castle.jpg)' }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Farcastles Attack Reason</h1>
        <p className="text-xl text-center mb-6">
          Easily attack north or south castle<br />
          Get reason to attack<br />
          And generative art using AI
        </p>
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-64">
            <label htmlFor="side" className="block text-sm font-medium leading-6 text-gray-900">
              Pick Side To Attack
            </label>
            <select value={selectedPick}
              onChange={handleChangePick} id="side" className="border rounded-md p-2 bg-white mt-2 block w-full">
              <option value="random">Random</option>
              <option value="north">North</option>
              <option value="south">South</option>

            </select>
          </div>
          <div className="w-64">
            <label htmlFor="crew" className="block text-sm font-medium leading-6 text-gray-900">
              Pick Crew
            </label>
            <select
              id="crew"
              className="border rounded-md p-2 bg-white mt-2 block w-full"
              value={selectedCrew}
              onChange={handleChange}
            >
              <option value="random">Random</option>
              <option value="0">🏴‍☠️🐺 “The Wolves”</option>
              <option value="1">🏴‍☠️🦂 “The Scorpions”</option>
              <option value="2">🏴‍☠️🐉 “The Dragons”</option>
              <option value="3">🏴‍☠️🦁 “The Lions”</option>
              <option value="4">🏴‍☠️🐍 “The Serpents”</option>
              <option value="5">🏴‍☠️🐌 “The Snails”</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <Button disabled={loading} onClick={async () => {
            try{
              setLoading(true)
              let yourPick=selectedPick
              let yourCrew=selectedCrew
              if(yourPick==="random"){
                const random = ["north", "south"];
                const randomIndex = Math.floor(Math.random() * 2);
                yourPick = random[randomIndex];
              }
              if(yourCrew==="random"){
                const randomIndex = Math.floor(Math.random() * 6);
                yourCrew = crews[randomIndex].text;
                setSelectedCrew(randomIndex.toString())
              }else{
                yourCrew=crews[parseInt(selectedCrew)].text
              }
              console.log(yourPick)
              console.log(yourCrew)
              setPickedCrew(yourCrew)
              setPickedCastle(yourPick)
              const node = { subdomain: "0x9b829bf1e151def03532ab355cdfe5cee001f4b0.us.gaianet.network", "model_name": "Meta-Llama-3-8B-Instruct-Q5_K_M" }
              const reasonToAttack = await ask(`{"crew":"${yourCrew}","attacking":"${yourPick}"}`, `You're an attack sequence generator there is a war between north and south castle, people can pick which castle they gonna attack by "attacking" data, people can pick what crew they attack with by "crew" data,give them a story on why they should attack their particular castle and how do they attack them from provided data, make it one liner,short, and concise`, node)
              const why = await reasonToAttack.json()
              const imageGenerator = await ask(`{"story":"${(why as any).choices[0].message.content}","image_prompt":"${imagePrompt}"}`, `based the story data replace [terrain type],[attacking group],[attacking action],[attacking action 2],[defending group],[Pick 'north castle attack' or 'south castle attack'], do not change the prompt only replace the bracket, answer in this schema {"image_prompt":"<image_prompt>"} with no explanation whatsoever, only answer in JSON format`, node)
              const imageRes = await imageGenerator.json()
              console.log((why as any).choices[0].message.content)
              console.log("generated prompt")
              console.log((imageRes as any).choices[0].message.content)
              // const image=await generateImageSD(JSON.parse((imageRes as any).choices[0].message.content).image_prompt)
              // const imageGenerated = await generateImage(`a text in the wall that say \`The reason why i attack ${yourPick} ${(why as any).choices[0].message.content}\``)
              // const imageGenerated = await generateImage(JSON.parse((imageRes as any).choices[0].message.content).image_prompt)
              const newGeneratedImage=await generateImageGaia(JSON.parse((imageRes as any).choices[0].message.content).image_prompt);
              // console.log((imageGenerated as any)[0].url)
              setAttackReason((why as any).choices[0].message.content)
              setGeneratedImage((newGeneratedImage as any).url)
              setLoading(false)
            }catch(e){
              //@ts-ignore
              console.log(e.message)
              notification.error("Sorry there is error on our end please generate again");
              setLoading(false)
            }

          }
          }>{loading?"please wait...":"Generate"}</Button>

        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <p className="bg-black text-white px-4 py-2 rounded-md">The crew you pick: {pickedCrew}</p>
          <p className="bg-black text-white px-4 py-2 rounded-md">The castle you attack: {pickedCastle}</p>
        </div>
        <Card className="p-4 mb-4  flex items-center justify-center">
          <p className="text-lg font-semibold">{attackReason || 'Attack reason'}</p>
        </Card>
       
        <div className="flex justify-center">
          {generatedImage && <img src={generatedImage} width={512} height={512} alt="Generated Image" />}
        </div>
        {attackReason !== '' && <div className="flex justify-center mt-4">
          <Button className="bg-purple-500" onClick={() => {
            window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(`!attack ${pickedCastle} ${crews[parseInt(selectedCrew)].value} ${attackReason}`)}&channelKey=farcastles&embeds[]=${generatedImage}`, '_blank');
            //  postComposerCreateCastActionMessage({
            //   text: `!join ${crews[parseInt(selectedCrew)].value}
            //   !attack ${selectedPick}
            //   ${attackReason}
            //   ` as string,
            //   embeds: [generatedImage],
            // });
          }}>Share</Button>
        </div>}
      </div>
    </div>
  )
}