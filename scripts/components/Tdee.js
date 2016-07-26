import React from 'react';
import h from '../helpers.js';
import ReactMixin from 'react-mixin'
import MoreInfoMixin from '../MoreInfoMixin';
import CSSTransitionGroup from 'react-addons-css-transition-group';


class Tdee extends React.Component{
  constructor(){
    super();
    this.state = {
      tdeeDesc : null
    };
  }
  /* Shorten calls to linkState */
  ls(id){
    return this.props.linkState('user.' + id);
  }

  /* Display Total Daily Energy Expenditure */
  renderTdee(){
    var tdee = this.props.user.tdee;
    if(tdee != null && tdee > 0){
      return (
        <div className='solution'>
          <div className='solLeft'></div>
          <h4 id='tdee'>Your TDEE is <span className='green'>{tdee}</span> calories</h4>
          <div className='solRight'></div>
        </div>
      );
    }
    if(!h.isNumber(this.props.user.bmr)){
      return (
        <div className='solution'>
          <div className='solLeft red'></div>
          <h4><span className='red'>BMR</span> required to calculate TDEE</h4>
          <div className='solRight red'></div>
        </div>
      )
    }
    return (
      <div className='solution'>
        <div className='solLeft red'></div>
        <h4><span className='red'>activity level</span> required</h4>
        <div className='solRight red'></div>
      </div>
    )
  }

  render(){
    if(typeof(this.props.user.bmr) == "string"){
      /* Hide component if prerequisite info is not provided */
      return null
    }
    var tdeeInfoText =
      (<div>
        TDEE estimates the total number of calories your body utilizes per day, accounting for your activity level.
        <ul>
          <li><span className='bold'>Sedentary</span> - Minimal physical activity and/or inactive job</li>
          <li><span className='bold'>Light</span> - Light activity a couple times a week</li>
          <li><span className='bold'>Moderate</span> - Difficult activity a few times a week</li>
          <li><span className='bold'>High</span> - Intense activity most days a week</li>
          <li><span className='bold'>Extreme</span> - Intense daily training and/or active work</li>
        </ul>
       </div>);
    return(
      <CSSTransitionGroup
        component='div'
        className='subCompTg'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
        transitionName='subcomp'
        transitionAppear={true}>
      <div key='tdeeCalcComp' id='tdeeCalc' className='subcomponent'>
        <h1>Total Daily Energy Expenditure {this.addInfoButton('tdeeDesc', tdeeInfoText, '', '')}</h1>
        <CSSTransitionGroup
          component='div'
          className='tg'
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}
          transitionName='info' >
          {this.state.tdeeDesc}
        </CSSTransitionGroup>
        <select selected="" id="activity" valueLink={this.ls('activity')}>
          <option value="">Select An Activity Level</option>
          <option value="1.2">Sedentary (No Exercise/Sports)</option>
          <option value="1.375">Light (1-2 days/wk)</option>
          <option value="1.55">Moderate (3-5 days/wk)</option>
          <option value="1.725">High (6-7 days/wk)</option>
          <option value="1.9">Extreme (Marathon, etc.)</option>
        </select>
        <br/>
        {this.renderTdee()}
      </div>
      </CSSTransitionGroup>
    );
  }
}

ReactMixin.onClass(Tdee, MoreInfoMixin);
export default Tdee;
