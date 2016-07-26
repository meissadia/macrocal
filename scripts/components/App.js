import React from 'react';
import ReactMixin from 'react-mixin';      /* ES6 Mixins */
import autobind from 'autobind-decorator'; /* ES7 Autobind */
import Catalyst from 'react-catalyst';     /* linkState Two-Way Binding */
import h from '../helpers'                 /* Helper Functions */
import mbp from '../macrosByPlan'          /* Macro Calculation Functions */
import { History } from 'react-router';    /* URL Navigation Control Mixin*/

var sampleData = require('../sample-data');

/* Custom Components */
import BMR from './bmr';
import TDEE from './tdee';
import BMI from './bmi';
import GOAL from './goal';
import MACROS from './macros';

/* App Component - Main */
@autobind
class App extends React.Component{

  newUser(){
    var defaultMacros = {p:0, f:0, c:0};
    return {
      gender : "MF",
      height_ft : "FT",
      height_in : "IN",
      plan : "",
      goal : "",
      age : 0,
      weight : "",
      bmr : null,
      activity : 0,
      tdee : null,
      neck : null,
      chest : null,
      arms : null,
      waist : null,
      hips : null,
      calsHigh : null,
      calsLow : null,
      macro_mode: '%',
      pcts : { l : null, h : null, d : null },
      macros : {t : defaultMacros, r : defaultMacros, p : defaultMacros}
    };
  }

  /* Initialize App State */
  constructor(){
    super(); // Call parent constructor
    this.state = {
      user : this.newUser()
    };
  }

  /* React Lifcycle : Once, immediately after the initial rendering occurs */
  componentDidMount(){
    // Restore saved user data
    var user = localStorage.getItem('user');
    if(user){
      var userObject = JSON.parse(user);
      this.setState({ user : userObject })
    } else {
      this.setState({ user : this.newUser() })
    }
  }

  /* React Lifecycle: When prop or state is changed */
  componentWillUpdate( nextProps , nextState ){
    // Run required calculations to update any dependent fields
    var user = nextState.user;
    user.bmr = this.calcBmr(user);
    user.tdee = this.calcTdee(user);
    user = this.setGoal(user);
    user = this.calcMacros(user);

    // Save modified data
    localStorage.setItem('user', JSON.stringify(user));
  }

  /* React Lifecycle: Each time component is rendered */
  componentDidUpdate(prevProps,prevState){
    /* Avoid pulling focus away when using keyboard for input */
    var bmi_skip    = ['waist','hips','neck'];
    var goal_skip   = ['goalPL','goalPH'];
    var macros_skip = ['protein','fat','carbs'];
    var skip_inputs = [].concat(bmi_skip, goal_skip, macros_skip);
    if(skip_inputs.indexOf(document.activeElement.id) > -1){
      return;
    }

    // Skip focus() where it can interferes with field navigation
    var skipList = ['iphone','ipad','ipod'];
    var userAgent = navigator.userAgent.toLowerCase();
    for(var agent of skipList){
      if(userAgent.indexOf(agent) > -1){
        document.getElementById('app-intro').style.padding = '5px 20px'; //IntroFix
        return;
      }
    }
    this.checkFocus(this.state.user);
  }

  checkFocus(user){
    var checkValues = ['gender', 'age', 'weight','height_ft', 'height_in', 'activity', 'goal', 'plan'];
    var defaultValues = ['MF','FT','IN', 0, "", null];
    for(var key of checkValues){
      if(user[key] == null || defaultValues.indexOf(user[key]) > -1){
        document.getElementById(key).focus();
        break;
      }
      if(!['waist','neck','hips'].indexOf(document.activeElement.id) > -1){
        document.getElementById(key).blur();
      }
    }
  }

  /* Calculate Basal Metabolic Rate (BMR) */
  calcBmr(user){
    // Check for required values
    var checkValues = ['gender', 'age', 'weight','height_ft', 'height_in'];
    var defaultValues = ['MF','FT','IN', 0, "", null];
    for(var key of checkValues){
      if(user[key] == null || defaultValues.indexOf(user[key]) > -1){
        return key; // Return error message
      }
    }

    /* Calculate BMR */
    var calcBmr = 0;
    if(user.gender=='M'){
      calcBmr = (66
      + (13.7 * h.lbsToKg(user.weight))
      + (5 * h.heightCm(user.height_ft, user.height_in))
      - (6.8 * parseInt(user.age)));
    }
    else if(user.gender=='F') {
      calcBmr = (655
      + (9.6 * h.lbsToKg(user.weight))
      + (1.8 * h.heightCm(user.height_ft, user.height_in))
      - (4.7 * parseInt(user.age)));
    }
    return Math.round(calcBmr);
  }

  /* Calculate Total Daily Energy Expenditure */
  calcTdee(user){
    var activity = parseFloat(user.activity);
    if(activity == null || user.bmr == null){
      return null;
    }
    return Math.round(user.activity * user.bmr);
  }

  /* Set calorie adjustments based on user select goal */
  setGoal(user){
    switch(user.goal){
      case 'slash':
        user.pcts = h.pct2obj(-30,10);
        break;
      case 'cut':
        user.pcts = h.pct2obj(-20,10);
        break;
      case 'recomp':
        user.pcts = h.pct2obj(-20,20);
        break;
      case 'gain':
        user.pcts = h.pct2obj(-10,20);
        break;
      case 'bulk':
        user.pcts = h.pct2obj(-10,30);
        break;
      case 'tailored':
        var i1 = user.pcts.l;
        var i2 = user.pcts.h;
        if(h.getElement('goalPL')){
          i1 = parseInt(h.getElement('goalPL').value);
        }
        if(h.getElement('goalPH')){
          i2 = parseInt(h.getElement('goalPH').value);
        }
        if(['iifym','lb'].indexOf(user.plan) > -1 ){
          i2 = i1;
        }
        user.pcts = h.pct2obj(i1,i2);
        break;
      default:
        user.calsHigh = null;
        user.calsLow = null;
        return user
    }
    user.calsLow = Math.round(user.tdee + (user.tdee * (user.pcts.l / 100)));
    user.calsHigh = Math.round(user.tdee + (user.tdee * (user.pcts.h / 100)));
    return user;
  }

  /* Determine user macros based on selected plan */
  calcMacros(user){
    switch (user.plan) {
      case 'primal':
        user.macros.t = mbp.calcPrimal(user.calsHigh, user.weight);
        user.macros.r = mbp.calcPrimal(user.calsLow, user.weight);
        break;
      case 'anabolic':
        user.macros.t = mbp.calcAnabolic(user.tdee, user.weight, 5);
        user.macros.r = mbp.calcAnabolic(user.tdee, user.weight, 2);
        break;
      case 'lg':
        user.macros.t = mbp.calcLeanGains(user.calsHigh, user.weight, 't');
        user.macros.r = mbp.calcLeanGains(user.calsLow, user.weight, 'r');
        break;
      case 'iifym':
        user = mbp.dailyPlan(user);
        user.macros.t = mbp.calcIIFYM(user.calsLow, user.weight);
        user.macros.r = user.macros.t;
        break;
      case 'lb':
        user = mbp.dailyPlan(user);
        user.macros.t = mbp.calcLeanBody(user.calsLow, user.weight);
        user.macros.r = user.macros.t;
        break;
      case 'tailored':
        if(user.macro_mode == '%'){
          user.macros.r = mbp.calcTailored(user.calsLow, user.macros.p)
          user.macros.t = mbp.calcTailored(user.calsHigh, user.macros.p)
          break;
        } else if(user.macro_mode == 'g'){
          user.macros.r = {
            p: user.macros.r.p, f: user.macros.r.f,
            c: mbp.calcCarbsRemaining(user.calsLow, user.macros.r.p, user.macros.r.f)
          }
          user.macros.t = {
            p: user.macros.t.p, f: user.macros.t.f,
            c: mbp.calcCarbsRemaining(user.calsHigh, user.macros.t.p, user.macros.t.f)
          }
        }
      default:
    }
    return user;
  }

  /* Reset all user data */
  reset(){
    delete localStorage.user;
    this.setState({
      user : this.newUser(),
      sample: false
    });
    // window.location.reload(); // force refresh (state update not recognized after initial load of sample data)
  }

  /* Load Sample Data */
  loadSampleData(event) {
    // event.preventDefault(); // Avoid page reload
    this.setState({
      user : sampleData,
      sample: true
    }); // update app state
  }

  toggleIntro(e){
    e.preventDefault();
    h.toggleClass({
      find_id : 'app-intro',
      toggle_class : 'app-intro-hide'
    });
  }

  /* Render App */
  render(){
    var logo = (<img className='logo' src="./build/css/images/logo.png" alt="MacroCal Logo"/>);
    return (
      <div className='app'>
        <header>
          {logo}
          <p className='subheader'>The Macronutrient Calculator</p>
        </header>
        <div id='app-intro' className='app-intro clearfix'>
          <div className='app-intro-msg'>
            &nbsp;&nbsp;&nbsp;Calculate macronutrient ratios tailored to your body, guided by your training style and eating habits, designed to support your goals. Complete the sections below to determine your current baseline and then customize a plan to help transform your body.
          </div>
          <div className='close-icon'>
            <input tabIndex={0} onClick={this.toggleIntro} type='image' src='./build/css/images/close.png'/>
            <div className='close-label'>
              Intro
            </div>
          </div>
        </div>

        <BMR user={this.state.user} linkState={this.linkState.bind(this)} />
        <BMI user={this.state.user} linkState={this.linkState.bind(this)} />
        <TDEE user={this.state.user} linkState={this.linkState.bind(this)} />
        <GOAL user={this.state.user} linkState={this.linkState.bind(this)} />
        <MACROS user={this.state.user} linkState={this.linkState.bind(this)} />
        <div className='buttons'>
          <button onClick={this.reset}>Clear Data</button>
          <button onClick={this.loadSampleData}>Sample User</button>
        </div>
        <footer>
          <div className='divIL half'>
            <a href="mailto:themacrocal@gmail.com">
              <img id='mail_icon' src="./build/css/images/mail.png" alt="mail_icon"/>
              Contact</a><br/>
            &copy; 2016 Meissa Dia
          </div>
        </footer>
        <div className='bottomSpacer'></div>
      </div>
    )
  }
}

/* Mixins */
ReactMixin.onClass(App, Catalyst.LinkedStateMixin);
ReactMixin.onClass(App, History);

export default App;
