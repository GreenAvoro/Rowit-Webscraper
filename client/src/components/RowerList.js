import React from 'react'

function RowerList(props) {

    const crews = props.rowers.map((crew,i) => {
        const rower_names = crew[0].map((rower,j) => <p key={j}>{rower}</p>)
        return(
            <div className="crew" key={i}>
                <div className="rower-names">{rower_names}</div>
                <p>{crew[1]}</p>
                <p>{crew[2]}</p>
            </div>
        )
    })

    return (
        <div className="rower-list">
            {crews}
        </div>
    )
}
export default RowerList