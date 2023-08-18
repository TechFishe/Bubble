import "./chat.css";
import Image from "next/image";

type person = {
    age:number,
    bday:Date,
    name:string,
    pfp:string
}

const testList:person[] = [{
    age: 15,
    bday: new Date("2008-02-30"),
    name: "Brooklyn",
    pfp: "/pfp/BabyPfp.JPG"
},{
    age: 15,
    bday: new Date("2008-04-26"),
    name: "Jacob",
    pfp: "/pfp/JakePfp.JPG"
}]

export default function Page(){
    const testMap = testList.map(person => <li className="flex items-center space-x-2 px-2 py-1">
        <Image src={person.pfp} alt="Profile pic" width={56} height={56} className="rounded-full object-cover h-14" />
        <div className="flex flex-grow">
            <section className="flex flex-col divide-y-[1px] divide-slate-700">
                <span className="font-semibold text-xl tracking-wide pb-[2px]">{person.name}</span>
                <small className="flex space-x-1 pt-[2px]">
                    <Image src="/Cake.svg" alt="Birthday cake image" width={20} height={20} />
                    <span>{person.bday.toDateString()}</span>
                </small>
            </section>
        </div>
	  	<button className="group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-color delay-75 duration-150 ease-in group-hover:text-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    </li>)

    return(
        <div className="one">
            <aside className="w-1/6 border-r-2 border-slate-50">
                <section className="border-b-[1px] border-slate-700 flex items-center">
                    <h2 className="flex flex-grow">Friends</h2>
                    <button className="flex w-fit h-fit mr-2 group rounded-full p-1.5 shadow-sm transition-all duration-150 ease-in hover:scale-[1.075] hover:bg-zinc-700 hover:shadow-md hover:shadow-green-400/25">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition-color delay-75 duration-150 ease-in group-hover:text-green-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                </section>
                <section>
                    <ul>{testMap}</ul>
                </section>
            </aside>
            <main className="w-5/6 h-full flex flex-col">
                <section className="w-full h-full"></section>
                <form action="" method="POST" className="self-end flex w-full debug px-4 py-2">
                    <input type="text" name="MSG Input" id="msg" autoCorrect="true" required className="flex flex-grow bg-slate-700 rounded-l-md px-1" />
                    <button type="submit" className="bg-slate-700 rounded-r-md px-1.5 py-0.5 group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 transition-color duration-150 ease-in group-hover:text-green-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </main>
        </div>
    )
}