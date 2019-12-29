import React from 'react'
let data = {
  time: Math.floor(Math.random() *5) + " hours ago" ,
  user: "Geof",
  title: "New Survey",
  description: ["Geoff created a new survey [Test]. ", "Survey has 5 guestions and is scheduled to be sent out at 13:00"],
  color: "red",
  id: Math.floor(Math.random() *10)
}
class SimpleFeedItem extends React.Component {
  render () {
    return(
      <li className="feed-item" data-content={data.user[0]} data-time={data.time} data-color="red">
        <section>
          <input type="checkbox" id={"expand_" + data.id} name={"expand_" + data.id} />
          <label htmlFor={"expand_" + data.id}>
            <b>{data.title}</b>
          </label>
          <main className="content">
            {
              data.description.map((desc)=>{
                return <div>{desc}</div>
              })
            }
            </main>
        </section>
      </li>
    )
  }
}

export default SimpleFeedItem;
