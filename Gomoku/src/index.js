import React from 'react';
import ReactDOM from 'react-dom';


class Chess extends React.Component {
    render() {
        return (
        	<div style = { this.props.color }></div>
        )
    }
}

class Square extends React.Component {
    render() {
        return ( 
        	<span   style = { SquareStyle }
                    color = { this.props.value.color }
                    id = { this.props.id }
                    onClick = { () => this.props.onClick(this.props.value.id) }
            >
                <Chess color = { this.props.value.color }/>
            </span>
        )
    }
}

class Row extends React.Component {
    render() {
        let Row = (length) => {
        	let SquareList = []
            for (var i = 0; i < length; i++) {
                SquareList.push(
                    <Square value = { this.props.value[i] } 
                		onClick = {
                            (id) => this.props.onClick(id)
                        }
                        key = { i } 
                        id = { this.props.value[i].id }
                    />
                )
            }
            return SquareList
        }
    return ( 
    	<div style = { RowStyle }> { Row(this.props.length) } </div>
        )
    }
}



class Board extends React.Component {
    constructor(props) {
        super(props)
    
        let number = 0
        let arr = new Array(this.props.length * this.props.length)
        for (let i = 0; i < this.props.length; i++) {
            for (let j = 0; j < this.props.length; j++) {
                let msg = {
                    id : number,
                    down : false,
                    type : '',
                    color : null
                }
                arr[i * this.props.length + j] = msg
                number = number + 1
            }
            
        }
        
        this.state = {
        	Squares: arr,
            isNext: true,
            status: true,
            history: []
        }
    }

	calculateWinner(i) {

        let stack = new Set()
        let count = 0
        let val = null
        let result = true 

        const check = (i,count,stack,val) => {
            
            let flag = true
                

            stack.forEach(function(e){
                if (e===i) {
                    flag = false
                    count = 0
                    stack.clear()
                }
            })

            if (flag) {

            let arr = this.state.Squares.slice(0) 
            
            let list = [
                -(ChessLength+1),-1,(ChessLength-1),
                -(ChessLength-1),1,(ChessLength+1),
                ChessLength,-ChessLength
            ]   
   

            if (arr[i].down) {
                if (i%ChessLength===0) {
                    list.splice(0,3)
                    if (i === 0) {
                        list.splice(0,1)
                        list.splice(3,1)
                    }
                    if (i === (ChessLength * ChessLength - ChessLength) ) {
                        list.splice(2,2)
                    }
                } else {
                    if (i%(ChessLength)===(ChessLength-1)) {
                        list.splice(3,3)
                        if (i === (ChessLength-1)) {
                            list.splice(0,1)
                            list.splice(3,1)
                        }
                        if (i === (ChessLength * ChessLength - 1)) {
                            list.splice(2,1)
                            list.splice(2,1)
                        }
                    } else {
                        if (i < ChessLength) {
                            list.splice(0,1)
                            list.splice(2,1)
                            list.splice(5,1)
                        }
                        if (i > ChessLength * ChessLength - ChessLength) {
                            list.splice(2,1)
                            list.splice(4,1)
                            list.splice(4,1)
                        }

                    }
                }
    
                list.forEach(function(e,index,array) {
                if (count!==0) {
                    if (val===e) {

                        if (arr[i + e].type===arr[i].type) {
                        
                            count = count + 1
                            stack.add(i)
                        
                        
                            if (count === 4) {
                                console.log(stack)
                                console.log(i+e)
                                result = false 

                            } else {
                                check(i + e,count,stack,e)
                                
                            }

                        }
                    }
                } else {
                    if (arr[i + e].type===arr[i].type) {
                        
                            count = count + 1
                            stack.add(i)
                        
                            check(i + e,count,stack,e)
                            
                        }
                }

                })

            }


            }


        }
        check(i,count,stack,val)

        this.setState({
                status: result
            })

    }
	

    handleClick(i) {


        let arr = this.state.Squares.slice(0)
        let his = this.state.history.slice(0)

		if (!arr[i].down && this.state.status) {


            arr[i].color = this.state.isNext ? red : black
            arr[i].type = this.state.isNext ? 'red' : 'black'
            arr[i].down = true

            his.push(i)


            this.setState({
                Squares: arr,
                isNext: !this.state.isNext,
                history: his
            })

            
            this.calculateWinner(i)
            


        } else {
            return false
        }
    }

    history() {
        let his = this.state.history.slice(0)
        let arr = this.state.Squares.slice(0)

        let one = his.pop()

        if (arr[one]) {
            arr[one] = {
                id : one,
                down : false,
                type : '',
                color : null
            }

            this.setState({
                Squares : arr,
                history : his,
                isNext : !this.state.isNext,
                status : true
                })  
        }
    }

    render() {
        let RowList = []
        let downer = ''

        if (this.state.status) {
            downer = this.state.isNext ? '现在轮到 => 红方' : '现在轮到 => 黑方'
        } else {
            downer = this.state.isNext ? '赢家是黑方' : '赢家是红方'
        }

        RowList.push(<div style = { marginTop } key = "board" > { downer } &nbsp;&nbsp;
                    <button key='btn' onClick = {() => this.history() } >regret</button>
                    </div>)

        let list = (length) => {
            for (let i = 0; i < length; i++) {
                let stateArray = this.state.Squares.slice(i * length,i * length + length)
                RowList.push(
                    <Row onClick = {
                            (id) => this.handleClick(id)
                        }
                        value = { stateArray } 
                        length = { this.props.length } 
                        key = { i } 
                    />)
            }
            return RowList
        }
    	return (
    		<div> { list(this.props.length) } </div>
    		)
    }
}

class App extends React.Component {
    render() {
    	return (
            <div>
    			<Board length = { this.props.length }/>
    		</div>
    		)
    }
}


const overview = {
    'margin': '0',
    'padding': '0'
 }
const marginTop = {
    'marginTop' : '20px'
}
const RowStyle = {
    display: 'block',
    width: '750px',
    height: '50px',
    margin: '0 auto'
}
const SquareStyle = {
    width: '48px',
    height: '48px',
    display: 'inline-block',
    border: '1px solid gray'
}
const red = {
    height: '100%',
    width: '100%',
    borderRadius: '25px',
    backgroundColor: 'red'
}
const black = {
    height: '100%',
    width: '100%',
    borderRadius: '25px',
    backgroundColor: 'black'
}

let ChessLength = 15
ReactDOM.render(<App length = { ChessLength } style={ overview }/>,
                document.getElementById('root'))




