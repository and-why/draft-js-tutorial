import React, { Component } from 'react';
import { EditorState, Editor, RichUtils, convertToRaw, convertFromRaw  } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

class DraftEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    const content = window.localStorage.getItem('content')

    if(content) {
      
      const convertedState = convertFromRaw(JSON.parse(content))
      console.log(convertedState)
      this.state.editorState = EditorState.createWithContent(convertedState);
      this.state.notes = stateToHTML(convertedState)
      console.log(JSON.parse(content))
      
    } else {
      this.state.editorState = EditorState.createEmpty();
    }

  }

  onChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    console.log('content state: ', convertToRaw(contentState))
    
    this.setState({
      editorState,
      notes: stateToHTML(editorState.getCurrentContent())
    });
  }
  saveContent = () => {
    const contentState = this.state.editorState.getCurrentContent();;
    window.localStorage.setItem('content', JSON.stringify(convertToRaw(contentState)))
    // let notes = JSON.stringify(convertToRaw(content))
    // this.setState({notes})
  }
  
  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    
    if(newState) {
      this.onChange(newState);
      return 'handled';
    }
    
    return 'not-handled';
  }
  
  onUnderlineClick = () => {
     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }
  onBoldClick = () => {
     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  onItalicClick = () => {
     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  onToggleCode = () => {
     this.onChange(RichUtils.toggleCode(this.state.editorState));
  }

  

  
  render() {
    return (
      <div>
        <button onClick={this.onUnderlineClick}>U</button>
        <button onClick={this.onBoldClick}>B</button>
        <button onClick={this.onItalicClick}>I</button>
        <button onClick={this.onToggleCode}>Code Block</button>
          <Editor
            handleKeyCommand={this.handleKeyCommand}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
          <button onClick={this.saveContent}>Save Data</button>

        
        <p dangerouslySetInnerHTML={{__html: this.state.notes}} />
      </div>
    );
  }
}

export default DraftEditor;