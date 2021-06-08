const findCartIndex = (cart, product) => {
  return cart.findIndex(
    (item) =>
      item.childProductId == product.childProductId ||
      item.childProductId == product.productId
  );
};

const findCartIndexWithPackId = (cart, product) => {
  return cart.findIndex(
    (item) =>
      item.childProductId == product.childProductId &&
      item.packId == product.packId
  );
};

const findQuantity = (cart, product, cartSection) => {
  let index = cartSection
    ? findCartIndexWithPackId(cart, product)
    : findCartIndex(cart, product);
  return cart[index] ? cart[index].quantity : "";
};

const FoodCartButtons = (props) => (
  <div
    style={{ float: props.float || "right", width: props.width || "70px" }}
    className={"align-items-center calculator-market" + " "}
  >
    <div
      className="substract"
      onClick={(event) =>
        props.editCart(
          props.cartProducts[
            props.cartProducts.findIndex(
              (item) =>
                item.childProductId == props.product.childProductId ||
                item.childProductId == props.product.productId
            )
          ],
          "",
          1,
          event
        )
      }
    />
    <div className="qtyNum">
      {findQuantity(props.cartProducts, props.product, props.cartSection)}
    </div>
    <div
      className="addition"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        props.openOptionsDialog(
          props.product.addOnAvailable > 0 ||
            (props.selectedUnit && props.selectedUnit.addOnAvailable > 0)
            ? props.product
            : props.cartProducts[
                props.cartProducts.findIndex(
                  (item) =>
                    item.childProductId == props.product.childProductId ||
                    item.childProductId == props.product.productId
                )
              ],
          2,
          event
        );
      }}
    >
      {/* onClick={() => props.openOptionsDialog(props.product.addOnAvailable > 0 ? props.product : props.cartProducts[props.cartProducts.findIndex((item) => item.childProductId == props.product.childProductId)], 2)}> */}
      +
    </div>
    {/* {props.cartLoadProdId == props.product.childProductId ? <span className="cartProg"></span> : ''} */}
  </div>
);

export default FoodCartButtons;
