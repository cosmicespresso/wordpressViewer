import React, {useState} from 'react';
import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [selectValue, setSelectValue] = useState('');

  const fetchData = async (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })
  }

  const handleChange = (e) => {
    setSelectValue(e.target.value);
    setData([])
  }

  return (
    <div className="App">
      <header>JSON/Wordpress API playground</header>

      <select name="endpoints" onChange={handleChange}>   
        <option value="">select a variable</option>
        <option value="categories">categories</option>
        <option value="comments">comments</option>
        <option value="media">media</option>
        <option value="posts">posts</option>
        <option value="tags">tags</option>
      </select>

      <button onClick={() => {setData([]); fetchData(`http://localhost:3002/${selectValue}`)} }>show local JSON</button>
      <button onClick={() => {setData([]); fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}`)}}>call Wordpress API </button>
      
      <header>{data.length > 0 ? `${data.length} entries` : null }</header>
      {data.length > 0 
        ? 
        data.map( (item) => (
          <div className='card' key={item.id}>
            <div className='card-header'>
              {Object.keys(item).map((headerKey, index) => {
                return (<div key={index}>{headerKey}</div>) 
              })}
            </div>   
            <div className='card-results' >
              {Object.keys(item).map((headerKey) => {
                const obj = item[headerKey]
                return (typeof obj === 'string' || typeof obj === 'number'  ? <div>{obj}</div> : <div>OBJECT</div>)
              })}              
            </div>
          </div>
        ))
        : null
      }
    </div>
  );
}

export default App;
