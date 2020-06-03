import React, {useState} from 'react';
import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const fetchData = async (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setIsLoading(false);
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

      <button onClick={() => {setData([]); setIsLoading(true); fetchData(`http://localhost:3002/${selectValue}`)} }>show local JSON</button>
      <button onClick={() => {setData([]); setIsLoading(true); fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=100`)}}>call Wordpress API </button>
      
      <header>{data.length > 0 ? `${data.length} entries` : null }</header>
      {!isLoading
        ? 
        data.map( (item) => (
          <div className='card' key={item.id}>
            <div className='card-header'>
              {Object.keys(item).map((headerKey, index) => {
                return ( headerKey !== 'meta' && headerKey !== '_links' 
                  ? (<div key={index}>{headerKey}</div>) 
                  : (null)) 
              })}
            </div>   
            <div className='card-results' >
              {Object.keys(item).map((headerKey, index) => {
                const obj = item[headerKey]
                return ( (headerKey !== 'meta' && headerKey !== '_links') 
                  ? (typeof obj === 'string' || typeof obj === 'number')  
                     ? <div key={index}>{headerKey.includes('date') || headerKey.includes('modified') ? obj.slice(0,10) : obj}</div>
                     : <ul className='object' key={index}> 
                       {obj && Object.keys(obj).map((objKey, index) => {
                          return (
                            typeof obj[objKey] === 'string' || typeof obj[objKey] === 'number' 
                            ? <li key={index}>{obj[objKey]}</li>
                            : 'TOO NESTED!'
                          ) 
                        })
                       }
                       </ul>
                  : (null)
                  )
              })}              
            </div>
          </div>
        ))
        : <div>Loading....</div>
      }
    </div>
  );
}

export default App;
