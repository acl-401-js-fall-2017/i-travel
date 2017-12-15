import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { loadExp, DeleteImage, addImageToExp } from './actions';
import styled from 'styled-components';


class Experience extends PureComponent {

  state = { 
    index: 0, 
  }

  componentDidMount() {
    this.props.loadExp(this.props.id);
    this.startListener();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrows);
  }

  startListener = ()=>{
    document.addEventListener('keydown', this.handleArrows); 
  }

  handleArrows = ({ key }) => {
    console.log(key);
    if(key ==='ArrowLeft' && this.state.index !== 0) this.handleClick(-1);
    if(key ==='ArrowRight' && this.state.index !== this.searchedExp().images.length -1) this.handleClick(1);
  }

  handleClick = (value) => {
    const newState = {
      ...this.state,
      index: this.state.index + value
    };
    this.setState(newState);
  }

  handleDelete = imageId => {
    this.props.DeleteImage(this.props.id, imageId);

  }

  handleImgPost = event =>{
    event.preventDefault();
    const form = event.target;
    const image = new FormData(form);
    form.reset();
    this.props.addImageToExp(this.props.id, image);
  }

  searchedExp = () => {
    return this.props.exp.find(exp => exp._id === this.props.id);
  }
    
  render() { 
    if(!this.searchedExp()) return <div>Page not avalible</div>;

    return (
      <div>
        <h3>You are viewing {this.searchedExp().user.name}'s experience in {this.searchedExp().location}</h3>
        { this.searchedExp().user.email === this.props.user.email && <button className="button" onClick={()=>{
          this.state.shouldDisplay
            ? this.setState({ shouldDisplay: false })
            : this.setState({ shouldDisplay: true });
        }}> AddImage </button>
        }
        <div>
          { this.state.shouldDisplay &&
          <form onSubmit={this.handleImgPost}> 
            <input
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png, .svg" 
              placeholder="Insert file"
            />
            <input name="caption" placeholder="caption"/>
            <button type="submit">Add</button>
          </form>
          } 
        </div>
        <StyledDiv>
          {(this.searchedExp().images)
            ?(<div>
              {this.searchedExp().images.map((img, i, array) => (
                <ImgDiv key={img._id} shouldDisplay ={this.state.index === i}>
                  {i !== 0 && <StyledButton className="button" onClick ={()=> this.handleClick(-1)}> ◀</StyledButton>}
                  
                  <StyledImgDiv>
                    <img style={{ width:'100%' }} src={img.imageURI} alt={img.caption}/>
                    <p style={{ marginLeft: '40%' }}> {img.caption} </p>
                  </StyledImgDiv>
                  <div>
                    { this.searchedExp().user.email === this.props.user.email &&<DeleteButton className ="button" onClick={() => this.handleDelete(img._id)}>X</DeleteButton>
                    }
                    { i !== array.length -1 && <StyledButton className="button" onClick ={()=> this.handleClick(1)}> ▶ </StyledButton>}
                  </div>
                </ImgDiv>
              ))}
            </div>)
            :<div> No images uploaded yet </div>
          }
          <h5> {this.searchedExp().description} </h5>
        </StyledDiv>
        <div>
          Tags:{this.searchedExp().tags && this.searchedExp().tags.map((tag, i) =>(<span key={i}>  {tag} </span>))}
          <h5> Have questions? shoot {this.searchedExp().user.name} an <a href={`mailto:${this.searchedExp().user.email}?Subject=Friend%20From%20iTravel`} target="_top">email</a></h5>
        </div>
      </div>
    );
  }
}

const StyledButton = styled.div`
margin-top: 30%;
`;

const StyledImgDiv = styled.div`
background-color: white;
display: flex;
flex-direction: column;
justify-content: center;

`;
const StyledDiv = styled.div`
width: 70%;
display: 'flex';
justify-content: flex-center;

`;

const ImgDiv = styled.div`
display:${props => props.shouldDisplay ? 'flex' : 'none'};
flex-direction: row;
justify-content: flex-start;
overflow: hidden;
margin: 0 10%;
`;

const DeleteButton = styled.button`
text-align: center;
`;

export default connect(
  state => ({ user: state.auth.user, exp: state.experiences }),
  { loadExp, addImageToExp, DeleteImage }
)(Experience); 