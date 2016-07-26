import React from 'react';

let UIElements =  {

  /* Display Caloric Adjustments For Plan */
  UIInput(opts){
    if(!opts){
      opts = {
        valLink: null,
        label: 'label:',
        unit: 'unit:',
        id: 'id:',
        disabled: false,
        readOnly: false,
        addClasses: null,
        onFocus: null,
        min: null,
        max: null,
        type: null,
        placeholder: null,
        divSizeClass: ''
      };
    }
    return(
      <div className={'ti divIL ' + opts.divSizeClass}>
        <label htmlFor={opts.id}>{opts.label}</label>
        <input
          id={opts.id}
          disabled={opts.disabled}
          readOnly={opts.readOnly}
          className={opts.addClasses}
          onFocus={opts.onFocus}
          onClick={opts.onClick}
          placeholder={opts.placeholder}
          type={opts.type} min={opts.min} max={opts.max}
          valueLink={opts.valLink}
          value={opts.value}/>
        <label>{opts.unit}</label>
      </div>
    )
  },

  UIMessage : function(opts){
    var colorClass = opts.colorClass || 'yellow';
    var plainMsg = opts.plainMsg || null;
    var coloredMsg = opts.coloredMsg || null;
    var plainMsgBefore = opts.plainMsgBefore || null;
    return (
      <div className='solution'>
        <div className={'solLeft ' + colorClass}></div>
        <h4>{plainMsgBefore}<span className={colorClass}>&nbsp;{coloredMsg}&nbsp;</span>{plainMsg}</h4>
        <div className={'solRight ' + colorClass}></div>
      </div>
    )
  }
}

export default UIElements;
