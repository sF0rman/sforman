import Col from "../components/layout/Col";

const StylePage = () => {
  return (
    <div className="style-page">
      <Col gap="large">
        <>
          <h1 className="h2">Styling</h1>

          <Col gap="normal">
            <>
              <h2 className="h3">Typography</h2>
              <p className="h1">Header 1</p>
              <p className="h2">Header 2</p>
              <p className="h3">Header 3</p>
              <p className="h4">Header 4</p>
              <p className="h5">Header 5</p>
              <p className="h6">Header 6</p>
              <p>This is a regular paragraph.</p>
            </>
          </Col>
        </>
      </Col>
    </div>
  );
};

export default StylePage;
