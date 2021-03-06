import React, { Component } from "react";
import { Icon, Alert, notification } from "antd";
import classes from "../Styles/Game.module.css";
import _ from "underscore";
const itemstest = [
  "alert",
  "bulb",
  "car",
  "frown",
  "experiment",
  "copyright",
  "thunderbolt",
  "skin",
  "scissor",
  "slack",
  "alert",
  "bulb",
  "car",
  "frown",
  "experiment",
  "copyright",
  "thunderbolt",
  "skin",
  "scissor",
  "slack"
];
class Game extends Component {
  state = {
    pickedItem: [],
    items: [],
    counter: 0,
    hint: false,
    hintCounter: 0,
  };
  componentDidMount() {
    let id = 1;
    for (let step = 0; step < itemstest.length; step++) {
       this.setState(prev => {
        return {
          items: _.sample([
            ...prev.items,
            { id: id++, name: itemstest[step], eq: false, clicked: false }
          ],20)
        };
      });
    }
  }
  Winner = (value, index, array) => {
    return value === true;
  };

  ItemClicked = (item, index) => {
    if (!this.state.pickedItem.map(i => i.id).includes(item.id)) {
      this.setState(
        prev => {
          return {
            counter: prev.counter + 1,
            pickedItem: [...prev.pickedItem, { ...item, clicked: true }],
            items: prev.items.map((items, i) => {
              if (index === i) return { ...items, clicked: true };
              else return items;
            })
          };
        },
        () => {
          if (
            this.state.pickedItem.length === 2 &&
            this.state.pickedItem.map(i => i.name)[0] ===
              this.state.pickedItem.map(i => i.name)[1]
          ) {
            this.setState(
              prev => {
                return {
                  items: prev.items.map((items, i) => {
                    if (items.name === item.name) return { ...items, eq: true };
                    else return items;
                  })
                };
              },
              () =>
                this.setState({ pickedItem: [] }, () =>
                  this.setState({
                    pickedItem: [
                      ...this.state.pickedItem,
                      { ...item, clicked: true }
                    ],
                    items: this.state.items.map((items, i) => {
                      if (items.name === item.name)
                        return { ...items, clicked: true };
                      else return items;
                    })
                  })
                )
            );
          } else if (
            this.state.pickedItem.length === 2 &&
            this.state.pickedItem.map(i => i.name)[0] !==
              this.state.pickedItem.map(i => i.name)[1]
          ) {
            this.setState({ pickedItem: [] }, () =>
              this.setState(
                {
                  pickedItem: [
                    ...this.state.pickedItem,
                    { ...item, clicked: true }
                  ]
                },
                () =>
                  setTimeout(() => {
                    this.setState({
                      items: this.state.items.map((items, i) => {
                        if (items.name === item.name)
                          return { ...items, clicked: false };
                        else return items;
                      })
                    });
                  }, 150)
              )
            );
          } else if (this.state.pickedItem.length === 1) {
            this.setState({ pickedItem: [] }, () =>
              this.setState(
                {
                  pickedItem: [
                    ...this.state.pickedItem,
                    { ...item, clicked: true }
                  ]
                },
                () =>
                  setTimeout(() => {
                    this.setState({
                      items: this.state.items.map((items, i) => {
                        if (items.name === item.name)
                          return { ...items, clicked: false };
                        else return items;
                      })
                    });
                  }, 150)
              )
            );
          }
        }
      );
    } else {
      this.Err("error");
    }
  };
  Err = type => {
    notification[type]({
      message: "Error 400",
      description: "You cannot select this card more than once."
    });
  };
  status = counter => {
    let point = (100 / counter).toFixed(2) * 100 - this.state.hintCounter * 20;
    switch (true) {
      case point > 220:
        return "Point :" + point + "  (WOW)";
        break;
      case point > 180:
        return "Point :" + point + "  (So Good)";
        break;
      case point > 160:
        return "Point :" + point + "  (Not Bad)";
        break;
      case point > 140:
        return "Point :" + point + "  (Increase your effort)";
        break;
      default:
        return "Point :" + point + "  (You Need Brain)";
    }
  };
  Retry = () => {
    let id = 1;
    this.setState({
      counter: 0,
      pickedItem: [],
      items:[]
    },()=>{
      for (let step = 0; step < itemstest.length; step++) {
        this.setState(prev => {
          return {
            items: _.sample([
              ...prev.items,
              { id: id++, name: itemstest[step], eq: false, clicked: false }
            ],20)
          };
        });
      }
    });
  };
  Hint = () => {
    this.setState(
      {
        hint: true,
        hintCounter: this.state.hintCounter + 1,
        items: this.state.items.map((items, i) => {
          if (items.clicked === false) return { ...items, clicked: true };
          else return items;
        })
      },
      () =>
        setTimeout(() => {
          this.setState({
            hint: false,
            items: this.state.items.map((items, i) => {
              if (items.eq !== true) return { ...items, clicked: false };
              else return items;
            })
          });
        }, 2000)
    );
  };
  render() {
    // console.log('pickedItem:' ,this.state.pickedItem);
    // console.log("items:", this.state.items);
    // console.log('cards :' ,this.state.cards);
    return (
      <>
        <div className={classes.gameContainer}>
          <span className={classes.nameGame}>MEMORY GAME</span>
          {this.state.items.map(i => i.eq).every(this.Winner) ? (
            <>
              <div className={classes.winner}>
                <p>Winner</p>
                <span>{this.status(this.state.counter)}</span>
                <button
                  className={classes.retryBtn}
                  onClick={() => this.Retry()}
                >
                  Retry
                </button>
              </div>
            </>
          ) : (
            <ul className={classes.items}>
              {this.state.items.map((i, index) => (
                <button
                  disabled={i.eq ? true : false}
                  key={i.id}
                  id={i.eq ? classes.itemEQ : classes.itemNEQ}
                  className={classes.item}
                  onClick={() => this.ItemClicked(i, index)}
                >
                  <Icon
                      key={i.id}
                    type={i.name}
                    className={i.eq ? classes.BtnIconEQ : classes.BtnIconNEQ}
                    style={{
                      display: `${i.clicked ? "block" : "none"}`
                    }}
                  />
                </button>
              ))}
            </ul>
          )}
          <div className={classes.allmsg}>
            <div className={classes.LastMove}>
              <span className={classes.LastMoveTxt}>Last :</span>
              <span>
                {this.state.pickedItem.map(i => (
                  <Icon
                      key={i.id}
                    type={i.name}
                    className={classes.LastMoveIcon}
                    style={{
                      display: "block"
                    }}
                  />
                ))}
              </span>
            </div>
            <div className={classes.counter}>
              <span style={{ color: "rgb(76,60,37)" }}>Moves :</span>
              <span style={{ paddingLeft: 15, color: "rgb(229,180,112)" }}>
                {this.state.counter}
              </span>
            </div>
            <div>
              <div className={classes.hintCounter}>
                <span style={{ color: "rgb(76,60,37)" }}>Hint :</span>
                <span style={{ paddingLeft: 15, color: "rgb(229,180,112)" }}>
                  {this.state.hintCounter}
                </span>
              </div>
            </div>
          </div>
          {this.state.hint ? (
            <div className={classes.hintMsg}>
              <span>Save In Memory</span>
            </div>
          ) : (
            <div
              className={classes.hint}
              style={{
                display: `${
                  this.state.items.map(i => i.eq).every(this.Winner)
                    ? "none"
                    : "block"
                }`
              }}
            >
              <button className={classes.hintBtn} onClick={this.Hint}>
                Hint
              </button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Game;
// background: linear-gradient(to right, #ad5389, #3c1053);
