import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {axiosInstance} from './utils/axios';
import ReactPaginate from 'react-paginate';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
  Table,
} from 'react-bootstrap';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [fbList, setFbList] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [queryStr, setQueryStr] = useState('');
  const [error, setError] = useState();
  const submitFileHandler = (e: any) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', selectedFiles[0]);
    axiosInstance
      .post('/feedbacks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (data: any) => {
          setProgress(Math.round(100 * (data.loaded / data.total)));
        },
      })
      .catch(error => {
        const code = error?.response?.data?.code;
        console.log('Upload error: ', code, error);
      });
  };

  const submitSearchHandler = (e: any) => {
    e.preventDefault();
    const queryParams = {page, limit: itemsPerPage};
    if (queryStr) {
      Object.assign(queryParams, {email: queryStr});
    }
    axiosInstance
      .get('/feedbacks', {
        params: queryParams,
      })
      .then(response => {
        const {data, metadata} = response?.data;
        setFbList(data);
        setPage(metadata.currentPage);
        setTotalPages(metadata.totalPages);
        //setItemsPerPage(metadata.itemsPerPage);
        setItems(Array(metadata.totalPages).map((_, i: number) => i + 1));
      })
      .catch(error => {
        console.log('search Error: ', error);
      });
  };

  const pageChangeHandler = (e: any) => {
    const queryParams = {page: e.selected + 1, limit: itemsPerPage};
    if (queryStr) {
      Object.assign(queryParams, {email: queryStr});
    }
    axiosInstance
      .get('/feedbacks', {
        params: queryParams,
      })
      .then(response => {
        const {data, metadata} = response?.data;
        setFbList(data);
        setPage(metadata.currentPage);
        setTotalPages(metadata.totalPages);
        //setItemsPerPage(metadata.itemsPerPage);
        setItems(Array(metadata.totalPages).map((_, i: number) => i + 1));
      })
      .catch(error => {
        console.log('pagination Error: ', error);
      });
  };

  return (
    <Container>
      <Row>
        <Col fluid="md">
          <Form onSubmit={submitFileHandler} className="mb-3">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload feedback data</Form.Label>
              <Form.Control
                type="file"
                onChange={(e: any) => setSelectedFiles(e.target.files)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress > 0 && (
              <ProgressBar now={progress} label={`${progress}%`} />
            )}
          </Form>
        </Col>
      </Row>

      <Row>
        <Col fluid="md">
          <Form onSubmit={submitSearchHandler} className="mb-3">
            <Form.Group controlId="formSearch" className="mb-3">
              <Form.Label>Search Feedbacks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter an email"
                onChange={(e: any) => setQueryStr(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col fluid="md" className="mt-3">
          <DataTable data={fbList} />
          <PaginatedItems
            items={items}
            totalPages={totalPages}
            pageClickHandler={pageChangeHandler}
          />
        </Col>
      </Row>
    </Container>
  );
}

function DataTable({data}: {data: any}) {
  let rows: any = (
    <tr>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  );
  if (data.length) {
    rows = data.map((item: any) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.postId}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.body}</td>
      </tr>
    ));
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Post ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Body</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

function Items({currentItems}: {currentItems: number[]}) {
  return (
    <>
      {currentItems &&
        currentItems.map((item: any) => (
          <div>
            <h3>Item #{item}</h3>
          </div>
        ))}
    </>
  );
}

function PaginatedItems({items, totalPages, pageClickHandler}: any) {
  return (
    <>
      <Items currentItems={items} />
      <ReactPaginate
        className="paginator"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={pageClickHandler}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
      />
    </>
  );
}

export default App;
