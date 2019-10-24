import React, { useState, useEffect } from 'react';
import './App.css';
import RowerList from './components/RowerList'

function App() {

  const [rowers, updateRowers] = useState([])
  const [loading, updateLoading] = useState(false)

  // Our form data state
  const [curRace, updateCurRace] = useState("")
  const [prevRace, updatePrevRace] = useState("")


  useEffect(() => {

    // fetch('/api/scrape')
    //   .then(res => res.json())
    //   .then(data => {
    //     updateRowers(data)
    //     updateLoading(() => false)
    //   })
  }, [])

  function handleChange(e) {
    if(e.target.name === "curRace") updateCurRace(e.target.value)
    else if (e.target.name === "prevRace") updatePrevRace(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const data_to_send = [
      curRace,
      prevRace
    ]
    


    fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data_to_send)
    })
      .then(res => res.json())
      .then(data => {
        updateRowers(data)
      })
  }


  return (
    <div className="App">
      <h1><i>Rowit.nz WEB SCRAPER</i></h1>

      <form onSubmit={handleSubmit}>
        <div className="main-form" >
          <div className="input-field">
            <label>URL for current race</label>
            <input name="curRace" value={curRace} onChange={handleChange} type="text" />
          </div>
          <div className="input-field">
            <label>URL for previous event</label>
            <input name="prevRace" value={prevRace} onChange={handleChange} type="text" />
          </div>
        </div>
        <input type="submit" value="Find Race Times" />
      </form>

      {/* Crew Table Header */}
      <div className="crew">
        <div className="rower-names"><p style={{fontWeight: "bold"}}>Names</p></div>
        <p>Race Time</p>
        <p>Placing</p>
      </div>

      {loading ? <p className="loading">Loading...</p> : <RowerList rowers={rowers} />}
    </div>
  );
}

export default App;
