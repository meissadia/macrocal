import React from 'react';
import ReactMixin from 'react-mixin'
import autobind from 'autobind-decorator';
import h from '../helpers.js';
import MoreInfoMixin from '../MoreInfoMixin';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import UIElements from '../UIElements' // Sitewide Customized UI Elements


@autobind
class Bmr extends React.Component {
  constructor(){
    super();
    this.state = {
      bmrDesc : null
    };
  }
  /* Shorten calls to linkState */
  ls(id){
    return this.props.linkState('user.' + id);
  }

  /* Display Basal Metabolic Rate */
  showBmr(){
    var bmr = this.props.user.bmr;
    if(typeof(bmr) == "string"){
      // Render error message
      return UIElements.UIMessage({
        coloredMsg: bmr.replace(/height_ft|height_in/g, "height"),
        plainMsg: 'required',
        colorClass: 'red'
       });
    }
    return UIElements.UIMessage({
      coloredMsg: bmr,
      colorClass: 'green',
      plainMsgBefore: 'Your BMR is',
      plainMsg: 'calories' });

  }

  render(){
    var bmrInfoText =
      "BMR is the amount of energy, expressed in calories, that a person needs to keep the body functioning at rest.";
    var infoSource = "https://en.wikipedia.org/wiki/Basal_metabolic_rate";
    var transitionTime = 300;
    return (
      <CSSTransitionGroup
        component='div'
        className='subCompTg'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
        transitionName='subcomp'
        transitionAppear={true}>
        <div key='bmrCalcComp' className='subcomponent' id='bmrCalc'>
          <h1>Basal Metabolic Rate {this.addInfoButton('bmrDesc', bmrInfoText, infoSource)}</h1>
          <CSSTransitionGroup
            component='div'
            className='tg'
            transitionEnterTimeout={100}
            transitionLeaveTimeout={100}
            transitionName='info'
            >
            {this.state.bmrDesc}
          </CSSTransitionGroup>
          <div className='divIL qtr'>
            <label htmlFor="gender">Gender</label><br/>
            <select required selected="MF" id='gender' valueLink={this.ls('gender')} tabIndex='1'>
              <option value="MF"></option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <br/><label htmlFor="gender"></label>
          </div>
          <div className='divIL qtr'>
            <label htmlFor="age">Age</label><br/>
            <select id="age" valueLink={this.ls('age')} tabIndex='2'>
              <option value=""></option>
              {h.generateRange(15,99).map(h.renderOption.bind(this,''))}
            </select>
            <br/><label htmlFor="age"></label>
          </div>
          <div className='divIL qtr'>
            <label htmlFor="weight">Weight</label><br/>
            <select id="weight" valueLink={this.ls('weight')} tabIndex='4'>
              <option value=""></option>
              {h.generateRange(80,400).map(h.renderOption.bind(this,''))}
            </select><br/>
            <label htmlFor="weight">lbs</label>
          </div>
          <div className='divIL qtr'>
            <label htmlFor="height_ft">Height</label><br/>
            <div className='divIL half'>
              <select id="height_ft" valueLink={this.ls('height_ft')} tabIndex='5'>
                <option value="FT"></option>
                {h.generateRange(4,7).map(h.renderOption.bind(this,''))}
              </select>
              <br/>
              <label htmlFor="height_ft">ft</label>
            </div>
            <div className='divIL half'>
              <select id="height_in" valueLink={this.ls('height_in')} tabIndex='6'>
                <option value="IN"></option>
                {h.generateRange(0,11).map(h.renderOption.bind(this,''))}
              </select>
              <br/>
              <label htmlFor="height_in">in</label>
            </div>
          </div>
          {this.showBmr()}
        </div>
      </CSSTransitionGroup>
    );
  }
}

ReactMixin.onClass(Bmr, MoreInfoMixin);

export default Bmr;
