import React, {useState, useEffect} from 'react';
import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 20;
  
  const fetchData = async (url) => {
    fetch(url)
      .then((res) => {
        setTotal(res.headers.get('X-WP-Total'))
        setTotalPages(res.headers.get('X-WP-TotalPages'))
        return res.json()
      })
      .then((result) => {
        setData(result);
        setIsLoading(false);
      })
  }

  const handleChange = (e) => {
    e.preventDefault();
    setPage(1); 
    setSelectValue(e.target.value);
    setData([]);
  }

  const handleButtonClick = (e) => {
    e.preventDefault();
    setData([]); 
    setIsLoading(true); 
    fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page}&orderby=id&order=desc`);
  }

  const handlePages = (e) => {
    e.preventDefault();
    setPage(page + 1);
    setData([]); 
    setIsLoading(true); 
    fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page+1}&orderby=id&order=desc`);
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

      {/*<button onClick={() => {setData([]); setIsLoading(true); fetchData(`http://localhost:3002/${selectValue}`)} }>show local JSON</button>*/}
      <button onClick={handleButtonClick}>call Wordpress API </button>
      
      <header>{data.length > 0 ? `There are ${total} entries across ${totalPages} page(s)` : null }</header>
      {!isLoading
        ? 
        data.map( (item, i) => (
          <div className='card' key={i}>
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
                       {obj && Object.keys(obj).map((objKey, objIndex) => {
                          return (
                            typeof obj[objKey] === 'string' || typeof obj[objKey] === 'number' 
                            ? <li key={objIndex}>{obj[objKey]}</li>
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
      {!isLoading && data.length > 0 &&  
        <div>
          <button className='loadmore' onClick={handlePages}>Load More</button>
          <div className='pagecount'>page {page}</div>
        </div>
      }
    </div>
  );
}

export default App;
