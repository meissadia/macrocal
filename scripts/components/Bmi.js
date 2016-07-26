import React from 'react';
import h from '../helpers.js';
import CSSTransitionGroup from 'react-addons-css-transition-group'
import UIElements from '../UIElements' // Sitewide Customized UI Elements

class Bmi extends React.Component{
  /* Shorten calls to linkState */
  ls(id){
    return this.props.linkState('user.' + id);
  }

  UIInput(opts){
    return UIElements.UIInput(opts);
  }

  /* calculate body fat % */
  bmi(){
    // Check for required input values
    var user = this.props.user;
    var defaultValues = [""];
    var requiredFields = ['waist', 'neck', 'height_ft', 'height_in'];
    if(user.gender != 'M'){
      requiredFields.push('hips');
    }
    for(var key of requiredFields){
      if(user[key] == null || defaultValues.indexOf(user[key]) > -1){
        key = key.replace(/height_ft|height_in/g, "height");
        return key;
      }
    }

    var height = h.heightIn(user.height_ft, user.height_in);
    var waist = parseFloat(user.waist);
    var neck = parseFloat(user.neck);
    var arms = parseFloat(user.arms);
    var chest = parseFloat(user.chest);
    var hips = parseFloat(user.hips);

    switch(user.gender){
      case 'M':
        return h.round2Dec((86.01*Math.log10(waist - neck))-(70.041*Math.log10(height)) + 36.76);
      default :
        return h.round2Dec((163.205*Math.log10(waist+hips-neck))-(97.684*Math.log10(height))-78.387);
    }
  }

  /* Calculate lean mass (lbs) */
  leanMass(){
    var bmi = this.bmi();
    if(!h.isNumber(bmi)){
      return null;
    }
    return Math.round((100 - this.bmi())/100 * this.props.user.weight);
  }

  // UIMessage(opts){
  //   // var colorClass = opts.colorClass || 'yellow';
  //   // var plainMsg = opts.plainMsg || null;
  //   // var coloredMsg = opts.coloredMsg || null
  //   // return (
  //   //   <div className='solution'>
  //   //     <div className={'solLeft ' + colorClass}></div>
  //   //     <h4><span className={colorClass}>{coloredMsg}</span>&nbsp;{plainMsg}</h4>
  //   //     <div className={'solRight ' + colorClass}></div>
  //   //   </div>
  //   // )
  //   return UIElements.UIMessage(opts);
  // }

  renderComposition(){
    var bmi = this.bmi();
    if(!h.isNumber(bmi)){
      if(typeof(bmi) != "string"){
        return UIElements.UIMessage({coloredMsg: 'invalid result'});
      }
      /* More Info Required */
      return UIElements.UIMessage({coloredMsg: bmi, plainMsg: 'required for BF%'})
    }
    var lm = this.leanMass();
    if(lm){
      return (
        <div>
          <div className='divIL half'><h4 id='bmi'><span className='green'>{bmi} <span className='pct_sign'>%</span></span><br/>Body Fat</h4></div>
          <div className='divIL half'><h4 id='leanmass'><span className='green'>{lm} lbs</span><br/>Lean Mass </h4></div>
        </div>
      )
    }
  }

  buildPctInput(valLink, label, unit, min, max, disabled=false){
    return (
      <div className='divIL third'>
        <label htmlFor={valLink}>{label}</label>
        <input id={valLink} disabled={disabled} placeholder='0'
               min={min} max={max} type="number" valueLink={this.ls(valLink)}/>
        <label>{unit}</label>
      </div>
    )
  }

  render(){
    if(typeof(this.props.user.bmr) == "string"){
      /* Hide component if prerequisite info is not provided */
      return null
    }

    var unit = "in"
    var hipsDisabled = this.props.user.gender == 'M'; // Hips only required for female users

    var unit = 'in';
    var min = 0;
    var max = 999;
    var type = 'number';
    var readOnly = false;
    var addClasses = null;
    var defOpts = {unit: unit, min: min, max: max, type: type, readOnly: readOnly, addClasses: addClasses ,divSizeClass: 'third', placeholder: 0};

    return (
      <CSSTransitionGroup
        component='div'
        className='subCompTg'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
        transitionName='subcomp'
        transitionAppear={true}>
        <div id='bmiCalc' className='subcomponent'>
          <details id='bmiFolder'>
          <summary>
            <h1 className="sTitle">Body Composition <p>(optional)</p></h1>
            </summary>
            <div className="bmiInputs">
              {this.UIInput(h.extend(defOpts, {
                valLink: this.ls('waist'),
                label: 'Waist',
                min: 20
              }))}
              {this.UIInput(h.extend(defOpts, {
                valLink: this.ls('neck'),
                label: 'Neck',
                min: 11
              }))}
              {this.UIInput(h.extend(defOpts, {
                valLink: this.ls('hips'),
                label: 'hips',
                min: 25,
                disabled: hipsDisabled
              }))}
              {this.renderComposition()}
            </div>
          </details>
        </div>
      </CSSTransitionGroup>
    );
  }
}

export default Bmi;
