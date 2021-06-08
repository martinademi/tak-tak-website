import React from "react";
import eventAvailable from "material-ui/svg-icons/notification/event-available";

// generate cart action buttons using product ID
const CartButtonsPID = props => {
  const { post, className } = props;
  return (
    <div style={{float: "right"}} className={"align-items-center calculator-market" + " " + className}>
      <div
        onClick={(event) =>
          props.editCart(
            props.cartProducts[
              props.cartProducts.findIndex(
                item => item.childProductId == post.childProductId
              )
            ],
            post,
            1,
            event
          )
        }
        className="substract"
      />
      <div className="qtyNum">
        {
          props.cartProducts[
            props.cartProducts.findIndex(
              item => item.childProductId == post.childProductId
            )
          ].quantity
        }
      </div>
      <div
        className="addition"
        onClick={(event) =>
          props.editCart(
            props.cartProducts[
              props.cartProducts.findIndex(
                item => item.childProductId == post.childProductId
              )
            ],
            post,
            2,
            event
          )
        }
      >
        +
      </div>
    </div>
  );
}

export default CartButtonsPID;
