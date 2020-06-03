import React, {useState, useEffect} from 'react';
import './App.css';


const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    return JSON.parse(
      localStorage.getItem(key) || JSON.stringify(defaultValue)
    );
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 20;
  const [data, setData] = usePersistedState(`${selectValue}page${page}`,[])

  const fetchData = async (url) => {
    fetch(url)
      .then((res) => {
        setTotal(res.headers.get('X-WP-Total'))
        setTotalPages(res.headers.get('X-WP-TotalPages'))
        return res.json()
      })
      .then((result) => {
        setData(result)
        setIsLoading(false);
      })
  }

  const handleChange = (e) => {
    e.preventDefault();
    setPage(1); 
    setSelectValue(e.target.value);
  }

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsLoading(true); 
    fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page}`);
  }

  const handlePages = (e) => {
    e.preventDefault();
    setPage(page + 1);
    setIsLoading(true); 
    fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page+1}`);
  }

  const handleSorting = (e) => {
    e.preventDefault();
    let orderyBy = e.target.value;
    (selectValue === 'categories' && orderyBy === 'date') 
     ? setData([]) 
     : fetchData(`https://wordsinspace.net/shannon/wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page}&orderby=${orderyBy}&order=asc`);
  }
  
  return (
    <div className="App">
      <header>Shannon's Wordpress entries</header>

      <select name="endpoints" onChange={handleChange}>   
        <option value="">select a variable</option>
        <option value="categories">categories</option>
        <option value="comments">comments</option>
        <option value="media">media</option>
        <option value="posts">posts</option>
        <option value="tags">tags</option>
        <option value="pages">pages</option>
        <option value="search">search</option>
      </select>

      {/*<button onClick={() => {setData([]); setIsLoading(true); fetchData(`http://localhost:3002/${selectValue}`)} }>show local JSON</button>*/}
      <button onClick={handleButtonClick}>call Wordpress API </button>
      
      <header>{data.length > 0 ? `There are ${total} entries across ${totalPages} page(s)` : null }</header>

      {!isLoading  && data.length > 0  && 
        <div className='controls'>
          <button value='id' onClick={handleSorting}>ordery by id</button>
          <button value='date' onClick={handleSorting}>ordery by date</button>
        </div>
      }

      {!isLoading  &&
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
                            : 'SHIT IS NESTED!'
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
      }
      {isLoading && <div>Loading....</div>}
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
