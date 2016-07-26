import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

var MoreInfoMixin = {
  /* Utilize component State to toggle display of additional information */
  toggleInfo : function(key, displayText, source, indent=true){
    var desc = this.state[key];
    var citation = (source != "") ? (<a href={source} target='_blank'> (source)</a>) : null;
    if(desc){
      this.setState({[key] : null});
    } else {
      this.setState({
        [key] : (<div key={key} className='infoText'>{indent === true ? "\u00A0\u00A0\u00A0" : indent}{displayText}{citation}</div>)
      });
    }
  },
  /* Create Info Button used to toggle info display*/
  addInfoButton : function(key, displayText, source="", indent=true){
    return (
      <input className='i' type="image" src="../../build/css/images/info.png" alt="info.png" tabIndex={0} onClick={this.toggleInfo.bind(this, key, displayText, source, indent)}/>
    );
  }
};

export default MoreInfoMixin;
