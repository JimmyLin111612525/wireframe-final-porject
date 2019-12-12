import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Modal,Button, Icon} from 'react-materialize';
import Draggable from 'react-draggable';
import {Rnd} from 'react-rnd';

class Wireframe extends Component{
    state={
        controls:this.props.wireframe.controls,
        index:null,
        selected:null,
        duplicate:0,
        position:{x:100,y:100},
        key:0,
    }

    componentDidMount=()=>{
        document.addEventListener('keydown',(e)=>{
            if(e.keyCode===46){
                this.deleteControl();
            }
            else if(e.ctrlKey && e.keyCode===68){
                this.duplicateControl();
            }
        });
    }

    deleteControl=()=>{
        console.log('delete control');
        if(this.state.selected){
            var controls=this.state.controls;
            var index=controls.indexOf(this.state.selected);
            controls[index].deleted=true;
            this.setState({controls:controls,selected:null});
        }
        document.querySelector('.specific-props').innerHTML='';
    }

    handleTrans=(trans,index)=>{
        var translateRemoved=trans.substring(trans.indexOf('translate(')+10);
        var x=translateRemoved.substring(0,translateRemoved.indexOf('px'));
        var split=translateRemoved.split(', ');
        var y=split[1].substring(0,split[1].indexOf('px'));
        var controls=this.state.controls;
        console.log(translateRemoved);
        console.log(x);
        console.log(y);
        console.log(controls[index-1]);
        var oLeft=parseInt(controls[index-1].left);
        var oTop=parseInt(controls[index-1].top);
        //var parsedX=parseInt(x)<0?0:parseInt(x);
        //var parsedY=parseInt(y)<0?0:parseInt(y);
        controls[index-1].left=oLeft+parseInt(x);
        controls[index-1].top=oTop+parseInt(y);
        //wireframe.controls[index-1].transX=x;
        //wireframe.controls[index-1].transY=y;
        return controls;
        //this.fixedPosition(index,parseInt(x),parseInt(y));
    }

    deselectControls=(e)=>{
        console.log(e.target);
        if(e.target.classList[0]==='wireframe-box'){
            console.log('deselecting controls!');
            document.querySelector('.specific-props').innerHTML='';
            this.setState({selected:null});
        }
    }

    showButtonProps=(e)=>{
        e.stopPropagation();

        for(var i=0;i<this.state.controls.length;i++){
            if(this.state.controls.length>0){
                var elms = document.querySelectorAll(`[id='w${this.state.controls[i].key}']`);
                if(elms.length>1){
                    for(var i = 0; i < elms.length-1; i++) 
                    elms[i].parentElement.removeChild(elms[i]);
                }
            }
        }        

        document.querySelector('.specific-props').innerHTML='';
        var trans=e.target.style.transform;
        //e.target.style.transform=`translate(0px, 0px)`;
        console.log(e.target);
        //console.log(trans);
        console.log(e.target.classList[0]);
        var className=e.target.classList[0];
        var index=className.split('-')[1];
        var controls=this.handleTrans(trans,index);
        console.log(index);
        var button=this.state.controls[index-1];
        var text=button.text;
        console.log(text);
        var markup=
        `
        <div class='button-markup'>
            <span class='button-text'>
                Text:
            </span>
            <input type='text' class='button-text-input' value=${text}>
            <br></br>
            <span class='button-text-color'>
                Text color:
            </span>
            <input type='color' class='button-text-color-picker' value=${button.color}>
            <br></br>
            <span class='button-text-font'>
                Font size:
            </span>
            <input type='text' class='button-font-input' value='${button.fontSize}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='button-color'>
                Button color:
            </span>
            <input type='color' class='button-color-picker' value='${button.backgroundColor}'>
            <br></br>
            <span class='border-width'>
                Border width:
            </span>
            <input type='text' class='button-border-width' value='${button.borderWidth}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='border-radius'>
                Border radius:
            </span>
            <input type='text' class='button-border-radius' value='${button.borderRadius}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='border-color'>
                Border color:
            </span>
            <input type='color' class='button-border-color-picker' value='${button.borderColor}'>
        </div>
        `
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.button-font-input').addEventListener('change',this.handleButtonFontChange);
        document.querySelector('.button-text-input').addEventListener('change',this.handleButtonTextChange);
        document.querySelector('.button-color-picker').addEventListener('change',this.handleButtonColorChange);
        document.querySelector('.button-border-width').addEventListener('change',this.handleButtonWidthChange);
        document.querySelector('.button-border-radius').addEventListener('change',this.handleButtonRadiusChange);
        document.querySelector('.button-border-color-picker').addEventListener('change',this.handleButtonBorderColor);
        document.querySelector('.button-text-color-picker').addEventListener('change', this.handleButtonTextColor);
        this.setState({controls:controls,index:index,key:this.state.key+1,selected:button});
    }

    handleButtonTextColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].color=document.querySelector('.button-text-color-picker').value;
        this.setState({controls:controls});
    }

    handleButtonBorderColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderColor=document.querySelector('.button-border-color-picker').value;
        this.setState({controls:controls});
    }

    handleButtonRadiusChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderRadius=document.querySelector('.button-border-radius').value;
        this.setState({controls:controls});
    }

    handleButtonWidthChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderWidth=document.querySelector('.button-border-width').value;
        this.setState({controls:controls});
    }

    handleButtonColorChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].backgroundColor=document.querySelector('.button-color-picker').value;
        this.setState({controls:controls});
    }

    handleButtonFontChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].fontSize=document.querySelector('.button-font-input').value;
        this.setState({controls:controls});
    }

    handleButtonTextChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].text=document.querySelector('.button-text-input').value;
        this.setState({controls:controls});
    }

    showLabelProps=(e)=>{

        for(var i=0;i<this.state.controls.length;i++){
            if(this.state.controls.length>0){
                var elms = document.querySelectorAll(`[id='w${this.state.controls[i].key}']`);
                if(elms.length>1){
                    for(var i = 0; i < elms.length-1; i++) 
                    elms[i].parentElement.removeChild(elms[i]);
                }
            }
        }

        e.stopPropagation();
        document.querySelector('.specific-props').innerHTML='';
        var trans=e.target.style.transform;
        console.log(console.log(e.target.classList[0]));
        var className=e.target.classList[0];
        var index=className.split('-')[1];
        var label=this.state.controls[index-1];
        var controls=this.handleTrans(trans,index);

        console.log(index);
        console.log(this.state.controls[index-1]);

        var font=null;
        var markup=
        `<div class='label-markup'>
            <span class='font-size'>
                Font size:
            </span>
            <input type='text' class='label-markup-input' value='${label.fontSize}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='label-text'>
                Label text:
            <input type='text' class='label-markup-text' value='${label.text}'>
            </span>
            <br></br>
            <span class='label-text-color'>
                Text color:
            </span>
            <input type="color" class="label-color-picker" value='${label.color}'>
        </div>`;
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.label-markup-input').addEventListener('change',this.handleLabelFontChange);
        document.querySelector('.label-markup-text').addEventListener('change',this.handleLabelTextChange);
        document.querySelector('.label-color-picker').addEventListener('change',this.handleLabelColorPicker);
        this.setState({controls:controls,index:index,key:this.state.key+1,selected:label});
    }

    showTextfieldProps=(e)=>{
        e.stopPropagation();
        
        for(var i=0;i<this.state.controls.length;i++){
            if(this.state.controls.length>0){
                var elms = document.querySelectorAll(`[id='w${this.state.controls[i].key}']`);
                if(elms.length>1){
                    for(var i = 0; i < elms.length-1; i++) 
                    elms[i].parentElement.removeChild(elms[i]);
                }
            }
        }


        document.querySelector('.specific-props').innerHTML='';
        console.log(e.target.classList);
        var className=e.target.classList[0];
        console.log(className);
        console.log(e.target);
        var index=className.split('-')[1];
        console.log(this.state.controls);
        var controls=this.handleTrans(e.target.style.transform,index);
        /*var coords=this.getCoords(e.target.style.transform);
        console.log(coords);*/
        var textfield=this.state.controls[index-1];
        /*textfield.right=coords.x;
        textfield.top=coords.y;
        controls[index-1]=textfield;
        this.setState({controls:controls});*/
        console.log(textfield);
        var markup=`
        <div class='textfield-markup'>
            <span class='textfield-text'>
                Text:
            </span>
            <input type='text' class='textfield-text-input' value='${textfield.text}'>
            <br></br>
            <span class='textfield-font'>
                Font:
            </span>
            <input type='text' class='textfield-font-input' value='${textfield.fontSize}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='textfield-text-color'>
                Text color:
            </span>
            <input type='color' class='textfield-text-color-picker' value='${textfield.color}'>
            <br></br>
            <span class='textfield-bg-color'>
                Background color:
            </span>
            <input type='color' class='textfield-bg-color-picker' value='${textfield.backgroundColor}'>
        </div>
        `;
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.textfield-text-input').addEventListener('change',this.handleTextfieldTextChange);
        document.querySelector('.textfield-font-input').addEventListener('change',this.handleTextfieldFontChange);
        document.querySelector('.textfield-text-color-picker').addEventListener('change',this.handleTextfieldTextColor);
        document.querySelector('.textfield-bg-color-picker').addEventListener('change',this.handleTextfieldBGColor);
        this.setState({controls:controls,index:index, key:this.state.key+1,selected:textfield});
    }

    getCoords=(translate)=>{
        var points=translate.substring(translate.indexOf('translate(')+10);
        var split=points.split('px');
        var x=split[0];
        var split2=split[1].split(' ');
        var y=split2[1];
        return {x:x,y:y};
    }

    handleTextfieldBGColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].backgroundColor=document.querySelector('.textfield-bg-color-picker').value;
        this.setState({controls:controls});
    }

    handleTextfieldTextColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].color=document.querySelector('.textfield-text-color-picker').value;
        this.setState({controls:controls});
    }

    handleTextfieldTextChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].text=document.querySelector('.textfield-text-input').value;
        this.setState({controls:controls});
    }

    handleTextfieldFontChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].fontSize=document.querySelector('.textfield-font-input').value;
        this.setState({controls:controls});
    }

    handleLabelColorPicker=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].color=document.querySelector('.label-color-picker').value;
        this.setState({controls:controls});
    }

    handleLabelFontChange=()=>{
        console.log(this.props.wireframe);
        console.log(this.state.index);
        var controls=this.state.controls;
        controls[this.state.index-1].fontSize=document.querySelector('.label-markup-input').value;
        this.setState({controls:controls}) 
    }
    
    handleLabelTextChange=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].text=document.querySelector('.label-markup-text').value;
        this.setState({controls:controls});
    }

    showContainerProps=(e)=>{
        e.stopPropagation();

        if(e.target.classList[0]!=='resizer'){
            for(var i=0;i<this.state.controls.length;i++){
            if(this.state.controls.length>0){
                var elms = document.querySelectorAll(`[id='w${this.state.controls[i].key}']`);
                if(elms.length>1){
                    for(var i = 0; i < elms.length-1; i++) 
                    elms[i].parentElement.removeChild(elms[i]);
                }
            }
        }

        var controls=this.state.controls;
        var trans=e.target.style.transform;
        document.querySelector('.specific-props').innerHTML='';
        console.log(e.target.classList);
        var className=e.target.classList[0];
        console.log(className);
        var index=className.split('-')[1];
        var controls=this.handleTrans(trans,index);
        console.log(this.state.controls);
        var container=this.state.controls[index-1];
        
        var markup=`
        <div class='container-markup'>
        <br></br>
            <span class='container-color'>
                Background color:
            </span>
            <input type='color' class='container-color-picker' value='${container.backgroundColor}'>
            <br></br>
            <span class='container-border-width'>
                Border width:
            </span>
            <input type='text' class='container-border-width-input' value='${container.borderWidth}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-radius'>
                Border radius;
            </span>
            <input type='text' class='container-border-radius-input' value='${container.borderRadius}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-color'>
                Border color:
            </span>
            <input type='color' class='container-border-color-input' value='${container.borderColor}'>
        </div>
        `;
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.container-color-picker').addEventListener('change',this.handleContainerColor);
        document.querySelector('.container-border-width-input').addEventListener('change', this.handleContainerBorderWidth);
        document.querySelector('.container-border-radius-input').addEventListener('change',this.handleContainerBorderRadius);
        document.querySelector('.container-border-color-input').addEventListener('change',this.handleContainerBorderColor);
        this.setState({controls:controls,index:index,key:this.state.key+1,selected:container});}
    }

    handleContainerBorderColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderColor=document.querySelector('.container-border-color-input').value;
        this.setState({controls:controls});
    }

    handleContainerBorderRadius=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderRadius=document.querySelector('.container-border-radius-input').value;
        this.setState({controls:controls});
    }

    handleContainerBorderWidth=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].borderWidth=document.querySelector('.container-border-width-input').value;
        this.setState({controls:controls});
    }

    handleContainerColor=()=>{
        var controls=this.state.controls;
        controls[this.state.index-1].backgroundColor=document.querySelector('.container-color-picker').value;
        this.setState({controls:controls});
    }

    duplicateControl=()=>{
        if(this.state.selected){
            console.log(this.state.selected);
            var controls=this.state.controls;
            var newControl=JSON.parse(JSON.stringify(this.state.selected));
            console.log(newControl);
            newControl.key=controls.length+1;
            newControl.left=this.state.selected.left+100;
            newControl.top=this.state.selected.top-100;
            newControl.controlWidth=this.state.selected.controlWidth;
            newControl.controlHeight=this.state.selected.controlHeight;
            console.log(newControl);
            controls.push(newControl);
            this.setState({controls:controls});
        }
    }

    updateDim=(e)=>{
        var parent=e.target.parentElement;
        console.log(e.target.parentElement);
    }

    onDragStop=(e,d)=>{
        e.stopPropagation();
        var controls=this.state.controls;
        console.log(e.target.classList);
        var className=e.target.classList[0];
        console.log(className);
        var index=className.split('-')[1];
        var container=controls[index-1];
        controls[index-1].left=d.x;
        controls[index-1].top=d.y;

        var markup=`
        <div class='container-markup'>
        <br></br>
            <span class='container-color'>
                Background color:
            </span>
            <input type='color' class='container-color-picker' value='${container.backgroundColor}'>
            <br></br>
            <span class='container-border-width'>
                Border width:
            </span>
            <input type='text' class='container-border-width-input' value='${container.borderWidth}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-radius'>
                Border radius;
            </span>
            <input type='text' class='container-border-radius-input' value='${container.borderRadius}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-color'>
                Border color:
            </span>
            <input type='color' class='container-border-color-input' value='${container.borderColor}'>
        </div>
        `;
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.container-color-picker').addEventListener('change',this.handleContainerColor);
        document.querySelector('.container-border-width-input').addEventListener('change', this.handleContainerBorderWidth);
        document.querySelector('.container-border-radius-input').addEventListener('change',this.handleContainerBorderRadius);
        document.querySelector('.container-border-color-input').addEventListener('change',this.handleContainerBorderColor);

        this.setState({controls:controls,index:index,selected:container});
    }

    onResizeStop=(e, direction, ref, delta, position,key)=>{
        e.stopPropagation();
        var controls=this.state.controls;
        console.log(key)
        controls[key-1].controlWidth=parseInt(controls[key-1].controlWidth)+parseInt(delta.width);
        controls[key-1].controlHeight=parseInt(controls[key-1].controlHeight)+parseInt(delta.height);
        console.log(position);
        var index=key;
        var container=controls[key-1];
        var markup=`
        <div class='container-markup'>
        <br></br>
            <span class='container-color'>
                Background color:
            </span>
            <input type='color' class='container-color-picker' value='${container.backgroundColor}'>
            <br></br>
            <span class='container-border-width'>
                Border width:
            </span>
            <input type='text' class='container-border-width-input' value='${container.borderWidth}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-radius'>
                Border radius;
            </span>
            <input type='text' class='container-border-radius-input' value='${container.borderRadius}' onkeydown="return ( event.ctrlKey || event.altKey 
                || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                || (95<event.keyCode && event.keyCode<106)
                || (event.keyCode==8) || (event.keyCode==9) 
                || (event.keyCode>34 && event.keyCode<40) 
                || (event.keyCode==46) ||(event.keyCode==13))">
            <br></br>
            <span class='container-border-color'>
                Border color:
            </span>
            <input type='color' class='container-border-color-input' value='${container.borderColor}'>
        </div>
        `;
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.container-color-picker').addEventListener('change',this.handleContainerColor);
        document.querySelector('.container-border-width-input').addEventListener('change', this.handleContainerBorderWidth);
        document.querySelector('.container-border-radius-input').addEventListener('change',this.handleContainerBorderRadius);
        document.querySelector('.container-border-color-input').addEventListener('change',this.handleContainerBorderColor);

        this.setState({controls:controls,index:index,selected:container});
    }

render(){
    var key=this.state.key;
        console.log(this.props.wireframe);
        var wireframeControls=this.state.controls;
        console.log(this.state.controls);

        var styling={
            width:`${this.props.width}px`, 
            height:`${this.props.height}px`, 
            backgroundColor:'#e1e6f2',
            borderColor:'black',
            borderWidth:'0.5px',
            borderStyle:'solid',
            borderRadius:'5px'
        }
        return(
            <div className='wireframe-box' onClick={this.deselectControls} style={styling} >
                {wireframeControls.map(control=>{
                    key++;
                        if(control.name==='addButton' && control){
                            var styling1=
                            {position:'absolute',
                                zIndex:'99',
                                left:`${control.left}px`,
                                top:`${control.top}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                textAlign:'center',
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,
                                backgroundColor:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].backgroundColor}`:`${control.backgroundColor}`):`${control.backgroundColor}`,
                                text:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`,
                                borderStyle:control.borderStyle,
                                borderWidth:`${control.borderWidth}px`,
                                borderColor:control.borderColor,
                                borderRadius:`${control.borderRadius}px`,
                                color:`${control.color}`,
                            }
                            return (
                                <Draggable key={new Date().getTime()} bounds='parent'>
                                    <button id={`w${control.key}`} className={`button-${control.key} button-control`} style={styling1} onClick={this.showButtonProps}>{control.text}</button>
                                </Draggable>
                            )
                        }
                        if(control.name==='addTextField'  && control){
                            var styling2=
                            {
                                position:'absolute',
                                zIndex:'99',
                                left:`${control.left}px`,
                                top:`${control.top}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].backgroundColor}`:`${control.backgroundColor}`):`${control.backgroundColor}`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,
                            }
                            return(
                                <Draggable key={new Date().getTime()} bounds='parent'>
                                    <input id={`w${control.key}`} className={`input-${control.key} input-control`} type="text" onClick={this.showTextfieldProps} value={this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`} style={styling2} onClick={this.showTextfieldProps}/>
                                </Draggable>
                                
                            )
                        }
                        if(control.name==='addLabel'  && control){
                            console.log(control.key);
                            var styling3={
                                position:'absolute',
                                zIndex:'99',
                                left:`${control.left}px`,
                                top:`${control.top}px`,
                                //width:`${control.controlWidth}px`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,//`${control.fontSize}px`,
                                //height:`${control.controlHeight}px`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`
                            }
                            return(
                                <Draggable key={new Date().getTime()} bounds='parent'>
                                    <p id={`w${control.key}`} className={`label-${control.key}`} style={styling3} onClick={this.showLabelProps}>{`${control.text}`}</p>
                                </Draggable>
                                
                            )
                        }else if(control.name==='addContainer' && !control.deleted){
                            /*var styling4={
                                position:'absolute',
                                left:`${control.left}px`,
                                top:`${control.top}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:`${control.backgroundColor}`,
                                borderStyle:`${control.borderStyle}`,
                                borderWidth:`${control.borderWidth}px`,
                                borderColor:`${control.borderColor}`,
                                borderRadius:`${control.borderRadius}px`,
                                zIndex:'1',
                            }*/
                            var styling4={backgroundColor:`${control.backgroundColor}`,
                            borderStyle:`${control.borderStyle}`,
                            borderWidth:`${control.borderWidth}px`,
                            borderColor:`${control.borderColor}`,
                            borderRadius:`${control.borderRadius}px`,
                            zIndex:'99',}
                            return(
                                <Rnd
                                id={`w${control.key}`} className={`container-${control.key} container-control`}
                                default={{width:control.controlWidth,height:control.controlHeight}} position={{x:control.left,y:control.top}} onDragStop={this.onDragStop} onResizeStop={(e, direction, ref, delta, position)=>this.onResizeStop(e, direction, ref, delta, position,control.key)} bounds='parent' style={styling4}>
                                    <div >
                                      
                                    </div>
                                </Rnd>
                            )
                        }
                        
                    })}
            </div>
        )
    }
}

export default Wireframe;

/*
<Draggable key={new Date().getTime()} bounds='parent'>
                                    <div id={`w${control.key}`} className={`container-${control.key} container-control`} style={styling4} onClick={this.showContainerProps}>
                                      
                                    </div>
                                </Draggable>
*/