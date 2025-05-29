import { forwardRef } from "react"
import "./FloatingBasket.css"

const FloatingBasket = forwardRef(({ basketItems, animatingComponent }, ref) => {
    return (
        <div className="floating-basket-container" ref={ref}>
            <div className={`floating-basket ${basketItems.length > 0 ? "has-items" : ""}`}>
                {/* Basket */}
                <div className="basket">
                    {/* Basket body */}
                    <div className="basket-body">
                        {/* Basket weave pattern */}
                        <div className="basket-weave">
                            <div className="weave-grid">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="weave-cell"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Basket handle */}
                    <div className="basket-handle"></div>

                    {/* Items in basket */}
                    <div className="basket-items">
                        {basketItems.slice(-3).map((itemId, index) => (
                            <div
                                key={`${itemId}-${index}`}
                                className="basket-item"
                                style={{
                                    "--item-index": index,
                                    zIndex: 10 + index,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Item counter */}
                {basketItems.length > 0 && <div className="item-counter">{basketItems.length}</div>}
            </div>
        </div>
    )
})

FloatingBasket.displayName = "FloatingBasket"

export default FloatingBasket
