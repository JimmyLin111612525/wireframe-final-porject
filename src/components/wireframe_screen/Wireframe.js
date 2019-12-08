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
        controls:null,
        index:null
    }

    showLabelProps=(e)=>{
        document.querySelector('.specific-props').innerHTML='';
        console.log(console.log(e.target.classList[0]));
        var className=e.target.classList[0];
        var index=className.split('-')[1];
        this.setState({index:index})
        var label=this.props.wireframe.controls[index-1];
        console.log(index);
        console.log(this.props.wireframe.controls[index-1]);
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
        document.querySelector('.label-markup-input').addEventListener('change',this.handleFontChange);
        document.querySelector('.label-markup-text').addEventListener('change',this.handleTextChange);
        document.querySelector('.label-color-picker').addEventListener('change',this.handleColorPicker);
    }

    handleColorPicker=()=>{
        var controls=this.props.wireframe.controls;
        controls[this.state.index-1].color=document.querySelector('.label-color-picker').value;
        this.setState({controls:controls});
    }

    handleFontChange=()=>{
        console.log(this.props.wireframe);
        console.log(this.state.index);
        var controls=this.props.wireframe.controls;
        controls[this.state.index-1].fontSize=document.querySelector('.label-markup-input').value;
        this.setState({controls:controls}) 
    }
    
    handleTextChange=()=>{
        var controls=this.props.wireframe.controls;
        controls[this.state.index-1].text=document.querySelector('.label-markup-text').value;
        this.setState({controls:controls});
    }

    render(){
        var wireframeControls=this.props.wireframe.controls;

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
            <div className='wireframe-box' style={styling}>
                {wireframeControls && wireframeControls.map(control=>{
                        if(control.name==='addButton'){
                            var styling1={position:'absolute',
                                positionX:`${control.positionX}px`,
                                positionY:`${control.positionY}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                textAlign:'center'
                            }
                            return (
                            <Draggable>
                                <Button bounds='parent' style={styling1}>button</Button>
                            </Draggable>
                            )
                        }
                        if(control.name==='addTextField'){
                            var styling2={
                                position:'absolute',
                                positionX:`${control.positionX}px`,
                                positionY:`${control.positionY}px`,
                                width:`${control.controlWidth}px`,
                                height:`${control.controlHeight}px`,
                                backgroundColor:'#fff'
                            }
                            return(
                                <Draggable bounds='parent'>
                                    <input type="text" placeholder='input' style={styling2}/>
                                </Draggable>
                                
                            )
                        }
                        if(control.name==='addLabel'){
                            console.log(control.key);
                            var styling3={
                                position:'absolute',
                                positionX:`${control.positionX}px`,
                                positionY:`${control.positionY}px`,
                                width:`${control.controlWidth}px`,
                                fontSize:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].fontSize}px`:`${control.fontSize}px`):`${control.fontSize}px`,//`${control.fontSize}px`,
                                height:`${control.controlHeight}px`,
                                color:this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].color}`:`${control.color}`):`${control.color}`
                            }
                            return(
                                <Draggable>
                                    <p className={`label-${control.key} label`} style={styling3} onClick={this.showLabelProps}>{this.state.controls?(this.state.controls[control.key-1]?`${this.state.controls[control.key-1].text}`:`${control.text}`):`${control.text}`}</p>
                                </Draggable>
                                
                            )
                        }
                    })}
            </div>
        )
    }
}

export default Wireframe;