import { Fragment, useEffect, useState } from "react";
import supabase from "./superbase"
import "./style.css";


const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";

}


function App() {
 
  const [showForm, setShowForm] = useState(false);
  const [facts, setFact] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(function(){
    async function getFact() {
      let query = supabase
      .from('fact')
      .select('*')
      if (currentCategory !== 'all') 
        query = query.eq('category', currentCategory)

        const { data: fact, error } = await query.order('text', {ascending: false}).limit(1000)

      setFact(fact)
      setIsLoading(false)
    }
    getFact()

  }, [currentCategory]);

  return (
    <>
      <Header setShowForm = {setShowForm} showForm = {showForm} />
      {showForm ? <NewFactForm setFact={setFact} setShowForm={setShowForm} /> : null}

      <main className="main">

        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {
          isLoading ? <Loader /> : <FactList facts={facts} />
        }
        
      </main>
    </>
  );
}

function Loader() {
  return (
    <span className="message">Loading .... </span>
  )
}

function Header( {setShowForm, showForm}) {
  const appTitle = "React Short Course";
  
  return (
    <header className="header">
      <div className="logo">
          <img src="./img/logo.png" alt="my web log" />
          <h1>{appTitle}</h1>
      </div>
      <button className="btn btn-large btn-open" onClick={() => setShowForm((show) => !show)}>
        {showForm ? 'Close': 'Share A Fact'}
        </button>
    </header>
  )

}

function NewFactForm({setFact, setShowForm}) {

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false)
  const textLength = text.length;

  async function handelSubmit(e)  {
    /* stop Browser loading */
    e.preventDefault();

    /* data ပါ မပါ စစ်ပါ */
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
    /* data အသစ်ကို data object သို့ ပြောင်းပါ */

    /*
    const newFact = {
      id: Math.round(Math.random() * 100000),
      text,
      source,
      category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: new Date().getFullYear(), 
    }
    */

    // save to superbase database and create fact new data
    const {data: newFact, error} = await supabase.from('fact').insert([text, source, category]).select('')

    console.log(newFact)
    setIsUploading(true)
    /* new Object Data ကို web UI မှာ ပြပါ*/
    
    // setFact((currentFacts) => [newFact, ...currentFacts]);

    // exiting data remove in form
    setText("")
    setSource("")
    setCategory("")

    // close form
    setShowForm(false)

    }


    
    console.log(text, source, category)
  }

  return (
    <form action="" className="fact-form" onSubmit={handelSubmit}>
        <input type="text" placeholder="Share a fact with the world" value={text} onChange={(e) => setText(e.target.value)} disabled = {isUploading} />
        <span>
          {200 - textLength}
        </span>
        <input type="text" placeholder="Trustworthy source..." value={source} onChange={(e) => setSource(e.target.value)} disabled = {isUploading} />
        <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)} disabled = {isUploading} >
          <option value="">Choose Category : </option>
          {
            CATEGORIES.map((cat) => 
            <option value={cat.name} key={cat.name}>{cat.name.toUpperCase()}</option>
            )
          }
        </select>
        <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter( {setCurrentCategory} ) {

  return (
    <aside>
      <ul>
          <li className="category">
              <button className="btn btn-all-category" onClick={() => {setCurrentCategory('all')}}>All</button>
          </li>
          {
            CATEGORIES.map((cat) => <li className="category" key={cat.name}>
            <button className="btn btn-category " style={{backgroundColor: cat.color}} onClick={() => setCurrentCategory(cat.name)}>{cat.name}</button>
        </li>
        )
          }
          
      </ul>
    </aside>
  )
}

function FactList({facts}) {

  // const facts = initialFacts;
  if (facts.length === 0) {
    return <span className="message">
      No Fact For This Category Yet! Create First One
    </span>
  }
  else {
    return (
      <section>
        <ul className="fact-list">
            {
              facts.map((el) => 
                <Fact factObj = {el} key={el.id} />
              
              )
            }
        </ul>
        <p>
          There are {facts.length} facts
        </p>
      </section>
    )
  }
  
  
}

function Fact({factObj}) {

  //const {factObj} = props;

  return (
  <li className="fact">
  <p className="">
      {
        factObj.text
      }
      <a className="source" href={factObj.source}>Source</a>
  </p>
  <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) => cat.name === factObj.category).color}}>{factObj.category}</span>
  <div className="vote-btn">
      <button>👍 <span>{factObj.votesInteresting}</span></button>
      <button>🤯 <span>{factObj.votesMindblowing}</span></button>
      <button>⛔️ <span>{factObj.votesFalse}</span></button>
  </div>
</li>
  )
}


export default App;
