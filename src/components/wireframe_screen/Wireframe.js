import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Modal,Button, Icon} from 'react-materialize';
import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

class Wireframe extends Component{
    state={
        controls:this.props.wireframe.controls,
        index:null,
        selected:null,
    }
    deleteControl=(e)=>{
            console.log('deleting controls');
        
            if(this.state.selected){
                var controls=this.state.controls;
                var id=`w${this.state.selected.key}`;
                console.log(controls);
                var index=controls.indexOf(this.state.selected);
                
                //controls.splice(controls.indexOf(this.state.selected),1);
                /*document.querySelector('.specific-props').innerHTML='';
                var el=document.getElementById(id);*/
                //console.log(el);
                //el.parentElement.removeChild(el);
                delete controls[index];
                /*var newControls=[];
                for(var i=0;i<controls.length;i++){
                    if(i!==index){
                        controls[i].key=i+1;
                        newControls.push(controls[i]);
                    }
                }*/
                /*console.log(controls);
                controls.splice(index,1);
                for(var i=0;i<controls.length;i++){
                        var thisID=`w${controls[i].key}`;
                        document.getElementById(thisID).style.transform=controls[i].trans;
                }*/
                this.setState({controls:controls, selected:null});
            }
        
    }

    deselectControls=(e)=>{
        console.log('deselecting controls!');
        document.querySelector('.specific-props').innerHTML='';
        this.setState({selected:null});
    }

    showButtonProps=(e)=>{
        e.stopPropagation();
        document.querySelector('.specific-props').innerHTML='';
        console.log(e.target.classList[0]);
        var className=e.target.classList[0];
        var index=className.split('-')[1];
        console.log(index);
        var button=this.state.controls[index-1];
        this.setState({index:index,selected:button});
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
        e.stopPropagation();
        document.querySelector('.specific-props').innerHTML='';
        console.log(console.log(e.target.classList[0]));
        var className=e.target.classList[0];
        var index=className.split('-')[1];
        var label=this.state.controls[index-1];
        this.setState({index:index,selected:label});
        
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
    }

    showTextfieldProps=(e)=>{
        e.stopPropagation();
        
        document.querySelector('.specific-props').innerHTML='';
        console.log(e.target.classList);
        var className=e.target.classList[0];
        console.log(className);
        var index=className.split('-')[1];
        console.log(this.state.controls);
        var controls=this.state.controls;
        /*var coords=this.getCoords(e.target.style.transform);
        console.log(coords);*/
        var textfield=this.state.controls[index-1];
        this.setState({index:index, selected:textfield});
        
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
        var controls=this.state.controls;
        var trans=e.target.style.transform;
        document.querySelector('.specific-props').innerHTML='';
        console.log(e.target.classList);
        var className=e.target.classList[0];
        console.log(className);
        var index=className.split('-')[1];
        console.log(this.state.controls);
        var container=this.state.controls[index-1];
        controls[index-1].trans=trans
        this.setState({controls:controls,index:index, selected:container});
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

    render(){
        document.addEventListener('keydown',(e)=>{
            if(e.keyCode===46){
                this.deleteControl();
            }
        });
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
            <div className='wireframe-box' style={styling} onClick={this.deselectControls}>
                {wireframeControls.map(control=>{
                        if(control.name==='addButton' && control){
                            var styling1=
                            {position:'absolute',
                                zIndex:'99',
                                right:`${control.right}px`,
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
                                <Draggable  bounds='parent'>
                                    <button id={`w${control.key}`} className={`button-${control.key} button-control`} style={styling1} onClick={this.showButtonProps}>{control.text}</button>
                                </Draggable>
                            )
                        }
                        if(control.name==='addTextField'  && control){
                            var styling2=
                            {
                                position:'absolute',
                                zIndex:'99',
                                right:`${control.right}px`,
                                top:`${control.top}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].backgroundColor}`:`${control.backgroundColor}`):`${control.backgroundColor}`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,
                            }
                            return(
                                <Draggable  bounds='parent'>
                                    <input id={`w${control.key}`} className={`input-${control.key} input-control`} type="text" onClick={this.showTextfieldProps} value={this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`} style={styling2} onClick={this.showTextfieldProps}/>
                                </Draggable>
                                
                            )
                        }
                        if(control.name==='addLabel'  && control){
                            console.log(control.key);
                            var styling3={
                                position:'absolute',
                                zIndex:'99',
                                right:`${control.right}px`,
                                top:`${control.top}px`,
                                //width:`${control.controlWidth}px`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,//`${control.fontSize}px`,
                                //height:`${control.controlHeight}px`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`
                            }
                            return(
                                <Draggable bounds='parent'>
                                    <p id={`w${control.key}`} className={`label-${control.key}`} style={styling3} onClick={this.showLabelProps}>{`${control.text}`}</p>
                                </Draggable>
                                
                            )
                        }else if(control.name==='addContainer' && control){
                            var styling4={
                                position:'absolute',
                                right:`${control.right}px`,
                                top:`${control.top}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:`${control.backgroundColor}`,
                                borderStyle:`${control.borderStyle}`,
                                borderWidth:`${control.borderWidth}px`,
                                borderColor:`${control.borderColor}`,
                                borderRadius:`${control.borderRadius}px`,
                                zIndex:'1',
                            }
                            return(
                                <Draggable bounds='parent'>
                                    <div id={`w${control.key}`} className={`container-${control.key}`} style={styling4} onClick={this.showContainerProps}>

                                    </div>
                                </Draggable>
                            )
                        }
                    })}
            </div>
        )
    }
}

export default Wireframe;