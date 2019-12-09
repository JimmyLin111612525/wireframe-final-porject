import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {Modal,Button, Icon} from 'react-materialize';
import Draggable from 'react-draggable';

class Wireframe extends Component{
    state={
        controls:this.props.wireframe.controls,
        index:null,
        selected:null,
    }
    deleteControl=(e)=>{
        e.stopPropagation();
        if(e.keyCode===46){
            console.log('deleting controls');
        
            if(this.state.selected){
                var controls=this.state.controls;
                var id=`w${this.state.selected.key}`;
                console.log(controls);
                
                //controls.splice(controls.indexOf(this.state.selected),1);
                document.querySelector('.specific-props').innerHTML='';
                var el=document.getElementById(id);
                console.log(el);
                el.parentElement.removeChild(el);
                
                var i=0;
                for(i=0;i<controls.length;i++){
                    controls[i].key=i+1;
                }
                console.log(controls);
                this.setState({controls:controls, selected:null});
            }
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
        
        var markup=
        `
        <div class='button-markup'>
            <span class='button-text'>
                Text:
            </span>
            <input type='text' class='button-text-input' value=${button.text}>
            <br></br>
            <span class='button-text-font'>
                Font size:
            </span>
            <input type='text' class='button-font-input' value=${button.fontSize}>
            <br></br>
            <span class='button-color'>
                Button color:
            </span>
            <input type='color' class='button-color-picker' value=${button.backgroundColor}>
        </div>
        `
        document.querySelector('.specific-props').innerHTML=markup;
        document.querySelector('.button-font-input').addEventListener('change',this.handleButtonFontChange);
        document.querySelector('.button-text-input').addEventListener('change',this.handleButtonTextChange);
        document.querySelector('.button-color-picker').addEventListener('change',this.handleButtonColorChange);
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
            <input type='text' class='label-markup-input' value=${label.fontSize}>
            <br></br>
            <span class='label-text'>
                Label text:
            <input type='text' class='label-markup-text' value=${label.text}>
            </span>
            <br></br>
            <span class='label-text-color'>
                Text color:
            </span>
            <input type="color" class="label-color-picker" value=${label.color}>
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
            <input type='text' class='textfield-text-input' value=${textfield.text}>
            <br></br>
            <span class='textfield-font'>
                Font:
            </span>
            <input type='text' class='textfield-font-input' value=${textfield.fontSize}>
            <br></br>
            <span class='textfield-text-color'>
                Text color:
            </span>
            <input type='color' class='textfield-text-color-picker' value=${textfield.color}>
            <br></br>
            <span class='textfield-bg-color'>
                Background color:
            </span>
            <input type='color' class='textfield-bg-color-picker' value=${textfield.backgroundColor}>
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

    

    render(){
        document.addEventListener('keydown',this.deleteControl);
        var wireframeControls=this.state.controls;

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
                        if(control.name==='addButton'){
                            var styling1={position:'absolute',
                                positionX:`${control.positionX}px`,
                                positionY:`${control.positionY}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                textAlign:'center',
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,
                                backgroundColor:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].backgroundColor}`:`${control.backgroundColor}`):`${control.backgroundColor}`,
                                text:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`
                            }
                            return (
                                <Draggable  bounds='parent'>
                                    <button id={`w${control.key}`} className={`button-${control.key} button-control`} style={styling1} onClick={this.showButtonProps}>{control.text}</button>
                                </Draggable>
                            )
                        }
                        if(control.name==='addTextField'){
                            var styling2={
                                position:'absolute',
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
                        if(control.name==='addLabel'){
                            console.log(control.key);
                            var styling3={
                                position:'absolute',
                                positionX:`${control.positionX}px`,
                                positionY:`${control.positionY}px`,
                                //width:`${control.controlWidth}px`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,//`${control.fontSize}px`,
                                //height:`${control.controlHeight}px`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`
                            }
                            return(
                                <Draggable bounds='parent'>
                                    <p id={`w${control.key}`} className={`label-${control.key}`} style={styling3} onClick={this.showLabelProps}>{this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`}</p>
                                </Draggable>
                                
                            )
                        }
                    })}
            </div>
        )
    }
}

export default Wireframe;