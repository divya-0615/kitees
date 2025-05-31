import React, { forwardRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './FloatingBasket.css';

const FloatingBasketInner = forwardRef(({ basketItems }, ref) => (
    <div className="customizable-kits-floating-basket-container" ref={ref}>
        <div
            className={`customizable-kits-floating-basket ${basketItems.length > 0 ? 'customizable-kits-has-items' : ''
                }`}
        >
            {/* Basket structure unchanged... */}
            <div className="customizable-kits-basket">
                <div className="customizable-kits-basket-body">
                    <div className="customizable-kits-basket-weave">
                        <div className="customizable-kits-weave-grid">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="customizable-kits-weave-cell" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="customizable-kits-basket-handle" />
                <div className="customizable-kits-basket-items">
                    {basketItems.slice(-3).map((itemId, index) => (
                        <div
                            key={`${itemId}-${index}`}
                            className="customizable-kits-basket-item"
                            style={{
                                '--item-index': index,
                                zIndex: 10 + index,
                            }}
                        />
                    ))}
                </div>
            </div>
            {basketItems.length > 0 && (
                <div className="customizable-kits-item-counter">
                    {basketItems.length}
                </div>
            )}
        </div>
    </div>
));

const FloatingBasket = forwardRef((props, ref) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return ReactDOM.createPortal(
        <FloatingBasketInner {...props} ref={ref} />,
        document.body
    );
});

FloatingBasket.displayName = 'FloatingBasket';

export default FloatingBasket;