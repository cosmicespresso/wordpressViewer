import React, {useState, useEffect} from 'react';
import './App.css';

import { Input, Select, Button, Row, Col, Spin, Table, Space} from 'antd';

const { Option } = Select;

function App() {

	const [isLoading, setIsLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageLimit = 100;
  const [data, setData] = useState([]);
  const [columns, setColumns]=useState([]);
  const [URL, setURL] = useState('https://wordsinspace.net/shannon/');

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

  const handleChange = (value) => {
    setPage(1); 
    setSelectValue(value);
  }

  const handleFetch = () => {
    setIsLoading(true); 
    fetchData(`${URL}wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page}`);
  }

  const handlePages = () => {
    setIsLoading(true); 
    setPage(page + 1);
    fetchData(`${URL}wp-json/wp/v2/${selectValue}?per_page=${pageLimit}&page=${page+1}`);
  }

  useEffect(()=>{
		// read headers
		if (data.length > 0) {
			let headers = Object.keys(data[0]).map( header => {
				return {
					title: header,
			    dataIndex: header,
			    key: header,
				}
			})
			setColumns(headers);
		}
  },[data])
  
  return (
    <div className="App">

    	<Space>
    		<Row tyle={{margin: '2vh 0'}}>
    			<Col span={24}>
			     	<Input onChange={e => setURL(e.target.value)} style={{ width: 400 }} placeholder="Enter a Wordpress URL" />
		     	</Col>
    		</Row>
    	</Space>

    	<Space>
		    <Row style={{margin: '2vh 0'}}>
		      <Col span={24}>
		      	<Select placeholder="Select an endpoint" style={{ width: 180}} onChange={handleChange}>   
				      <Option style={{ width: 'auto' }} value="categories">categories</Option>
				      <Option style={{ width: 'auto' }} value="comments">comments</Option>
				      <Option style={{ width: 'auto' }} value="media">media</Option>
				      <Option style={{ width: 'auto' }} value="posts">posts</Option>
				      <Option style={{ width: 'auto' }} value="tags">tags</Option>
				      <Option style={{ width: 'auto' }} value="pages">pages</Option>
				      <Option style={{ width: 'auto' }} value="search">search</Option>
				    </Select>
		      </Col>
		    </Row>
	  	
				<Row style={{margin: '2vh 0'}}>
		      <Col span={24}>
						<Button type="primary" loading={isLoading} style={{ width: 180}} onClick={handleFetch}>
			        Call Wordpress API 
			      </Button>
		      </Col>
		    </Row>

	    </Space>

			<Row style={{margin: '2vh 0'}}>
	      <Col span={24}>
			  	{!isLoading
			  		? 
			  			data.length > 0 
			  				? (
			  						<Space direction={'vertical'} style={{textAlign: 'left'}}>
			  							<Space direction={'vertical'}>
	      								<div>{data.length > 0 ? `There are ${total} entries across ${totalPages} page(s)` : null }</div>
			  							</Space>

											<Table  pagination={{
							          pageSize: 100,
							          defaultCurrent: 1,
							          defaultPageSize: 100,
							          size: 'small',
							          current: page, 
							          total: totalPages,
							          simple: true,
							          showQuickJumper: false
							        }} 
        							bordered rowKey="id"  size="small" columns={columns} dataSource={data} pagination={{ position: ['bottomLeft'] }}   />
											
											<Button type="secondary" onClick={handlePages}>{total-pageLimit*page > 0 ? `Fetch the next ${total-pageLimit*page} entries` : 'No more entries to fetch'}</Button>
										</Space>
			  					)
			  				: null
			  		: <Spin />
			    }
	      </Col>
	    </Row>    		
    </div>
  );
}

export default App;
