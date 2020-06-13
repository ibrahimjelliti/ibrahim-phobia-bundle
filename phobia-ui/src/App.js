import React, { useState } from "react";
import { Row, Col, Input, Statistic, Icon, Spin, Alert, Typography } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import Axios from "axios";
import SizeBarChart from "./Barchart";
const prettyBytes = require('pretty-bytes');

const { Title } = Typography;
function App() {
  //  state variable
  const [metadata, setMetadata] = useState({});
  const [searchPackage, setSearchPackage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    return setSearchPackage(e.currentTarget.value);
  };
  // search package bundle cost 
  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await Axios.get(
        `http://localhost:4000/search?package=${searchPackage.toLowerCase()}`
      );

      if (!data.error) {
        setMetadata(data);
        setError("");
        return setIsLoading(false);
      } else
        setError("Package not found");

    } catch (error) {
      setError("The package you searched couldn't be found!!!");
      return setIsLoading(false);
    }
  };

  const onClose = e => { };
  const { data } = metadata;

  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

  return (
    <div className="App">
      <Row
        type="flex"
        align="middle"
        style={{ padding: "20px", margin: "20px", height: "100vh" }}
      >
        <Col span={14} offset={5}>
          <Title>Cost of Modules</Title>
          <Title level={4} style={{ fontWeight: "300", paddingBottom: "18px", color: '#777' }}>
            find the cost of adding a npm package to your bundle
          </Title>
          <form onSubmit={handleSubmit}>
            <Input
              size="large"
              placeholder="Type a package name"
              onChange={handleChange}
              value={searchPackage}
              style={{
                padding: "35px 35px 35px 30px",
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "400"
              }}
            />
          </form>

          {isLoading ? (
            <Spin indicator={antIcon} style={{ margin: "30px" }} />
          ) : (
              <>
                {error ? (
                  <Alert
                    message="Error Text"
                    description={error}
                    type="error"
                    closable
                    onClose={onClose}
                  />
                ) : (
                    <Row style={{ margin: "30px" }}>
                      <Col span={8}>{data && <Stats metadata={data} />}</Col>
                      <Col span={8}>{data && <SizeBarChart chartData={data} />}</Col>
                    </Row>
                  )}
              </>
            )}
        </Col>
      </Row>
    </div>
  );
}

function Stats({ metadata }) {
  const { name, description, sizes } = metadata;
  return (
    <>
      <Title>{name}</Title>
      <p>{description}</p>
      <h2>BUNDLE SIZE</h2>
      <Row>        
        <Col span={12}>
          <Statistic title="MINIFIED" value={prettyBytes(sizes[sizes.length - 1].minified)} />
        </Col>
        <Col span={12}>
          <Statistic title="GZIPPED" value={prettyBytes(sizes[sizes.length - 1].gzip)} />
        </Col>
      </Row>
    </>
  );
}

export default App;
