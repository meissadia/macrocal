import React from 'react';
import h from '../helpers.js';
import ReactMixin from 'react-mixin'
import autobind from 'autobind-decorator'; /* ES7 Autobind */
import MoreInfoMixin from '../MoreInfoMixin';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import UIElements from '../UIElements' // Sitewide Customized UI Elements

@autobind
class Goal extends React.Component{
  constructor(){
    super();
    this.state = {
      goalDesc : null
    }
  }

  /* Shorten calls to linkState */
  ls(id){
    return this.props.linkState('user.' + id);
  }

  // /* Display Caloric Adjustments For Plan */
  UIInput(opts){
    return UIElements.UIInput(opts);
  }

  dummy(){
    return;
  }

  /* Compose a div with one input column and one output column */
  buildAdjustmentColumn(opts){
    if(!opts){
      opts = {
        title: 'title:',
        leftContent: 'leftContent:',
        rLabel: 'rLabel:',
        rValue: 'rValue:',
        spacer: 'spacer:',
        rlLink: 'rlLink:',
        disabled: false,
        addClasses: null
      };
    }
    return (
      <div className='divIL half'>
        <h4>{opts.title}</h4>
        <div className='divIL half'>
          <label className='cLab'>
            <span className={opts.addClasses}>
              {opts.leftContent}
            </span>
          </label>
        </div>
        <div className='ti divIL half'>
          <label htmlFor={opts.rlLink} className='cLab'>
            <label>{opts.rLabel}</label><br/>
            <input
              className='il green'
              readOnly
              disabled={opts.disabled}
              tabIndex='-1'
              placeholder='0'
              type="number"
              value={opts.rValue}
              onChange={this.dummy}/>
            {opts.spacer ? opts.spacer : (<label className='white'>&nbsp;</label>)}
          </label>
        </div>
      </div>
    )
  }

  showAdjustments(titles){
    var user = this.props.user;
    if(user.calsLow == null || user.calsHigh == null){
      return (
        <div className='solution'>
          <div className='solLeft red'></div>
          <h4><span className='red'>goal</span> required</h4>
          <div className='solRight red'></div>
        </div>
      )
    }

    /* Show inputs for custom Goal */
    var spacer = (<label className='white'>&nbsp;</label>);
    var label = 'Change';
    if (user.goal == 'tailored'){
        /* Custom Percent Inputs */
        var unit = '%';
        var disabled = false;
        var readOnly = null;
        var pctL =
          this.UIInput({
            valLink: this.ls('pcts.l'),
            label: label,
            unit: unit,
            id: 'goalPL',
            disabled: disabled,
            type: 'number',
            min: '-100',
            max: '100'
          });
        var pctH = !titles.t2 ? null :
          this.UIInput({
            valLink: this.ls('pcts.h'),
            label: label,
            unit: unit,
            id: 'goalPH',
            disabled: disabled,
            type: 'number',
            min: '-100',
            max: '100'
          });
    } else {
      /* Percentage Display Only*/
      var unit = '%';
      var disabled = false;
      var readOnly = true;
      var addClasses = 'green';
      var pctL =
        this.UIInput({
          valLink: this.ls('pcts.l'),
          label: label,
          unit: unit,
          id: 'goalPL',
          disabled: disabled,
          readOnly: readOnly,
          addClasses: addClasses,
          onFocus: h.blur,
          type: 'number',
          min: '-100',
          max: '100'
        });
      var pctH = !titles.t2 ? null :
        this.UIInput({
          valLink: this.ls('pcts.h'),
          label: label,
          unit: unit,
          id: 'goalPH',
          disabled: disabled,
          readOnly: readOnly,
          addClasses: addClasses,
          onFocus: h.blur,
          type: 'number',
          min: '-100',
          max: '100'
        });
      spacer = null;
    }

    /* Compose Calorie Adjustment columns */
    var d1 = !titles.t1 ? null :
      this.buildAdjustmentColumn({
            title: titles.t1,
            leftContent: pctL,
            rLabel: 'Calories',
            rValue: user.calsLow,
            spacer: spacer,
            rlLink: 'goalPL'
          });
    var d2 = !titles.t2 ? null :
      this.buildAdjustmentColumn({
        title: titles.t2,
        leftContent: pctH,
        rLabel: 'Calories',
        rValue: user.calsHigh,
        spacer: spacer,
        rlLink: 'goalPH'
      });

    return(
      <div>
        {d1}
        {d2}
      </div>
    )
  }

  render(){
    if(this.props.user.activity == "" || isNaN(parseInt(this.props.user.tdee))){
      /* Hide component if prerequisite info is not provided */
      return null;
    }
    var goalInfoText = (
      <div>
        Determines how agressively your caloric intake is adjusted to maximize muscle while minimizing fat. Some plans (set under <span className='bold'>Macros</span> section) recommend you cycle caloric intake, others call for a steady daily target.
        <ul>
          <li>Use CUSTOM to input your own percentages.</li>
        </ul>
      </div>);
    return (
      <CSSTransitionGroup
        component='div'
        className='subCompTg'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
        transitionAppearTimeout={1000}
        transitionName='subcomp'
        transitionAppear={true}>
        <div key='goalComp' id='adjustments' className='subcomponent'>
          <h1>Goal {this.addInfoButton('goalDesc', goalInfoText, '', '')}</h1>
          <CSSTransitionGroup
            component='div'
            className='tg'
            transitionEnterTimeout={100}
            transitionLeaveTimeout={100}
            transitionName='info' >
            {this.state.goalDesc}
          </CSSTransitionGroup>
          <select selected="" id="goal" valueLink={this.ls('goal')}>
            <option value="">Select A Goal</option>
            <option value="slash">Agressive Cut</option>
            <option value="cut">Cut Fat</option>
            <option value="recomp">Transform</option>
            <option value="gain">Build Muscle</option>
            <option value="bulk">Bulk</option>
            <option value="tailored">Custom</option>
          </select>
          <br/>
          {this.showAdjustments(h.getTitles(this.props.user.plan))}
        </div>
      </CSSTransitionGroup>
    );
  }
}

ReactMixin.onClass(Goal, MoreInfoMixin);
export default Goal;
