import React, {
  PropTypes,
} from 'react';

const Footer = () => {
  const { width, height } = this.props.viewport;
  return (
    <div className="Footer">
      <div className="Footer-container">
        footer copyright `${width} --- ${height}`
      </div>
    </div>
  );
};

Footer.propTypes = {
  viewport: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

export default Footer;
