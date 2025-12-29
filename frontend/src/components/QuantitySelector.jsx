import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const QuantitySelector = ({ value, max, onChange, onRemove, disabled }) => {
    const [showMaxError, setShowMaxError] = useState(false);

    const handleDecrement = () => {
        if (value > 1) {
            onChange(value - 1);
            setShowMaxError(false);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        } else {
            setShowMaxError(true);
            setTimeout(() => setShowMaxError(false), 2000);
        }
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props} className="bg-danger text-white">
            Max limit reached
        </Tooltip>
    );

    return (
        <div className="d-flex align-items-center position-relative">
            <div className="d-flex align-items-center justify-content-between qty-control bg-light rounded-pill p-1 border">
                <Button
                    variant="link"
                    size="sm"
                    className="text-decoration-none text-dark fw-bold px-3"
                    onClick={() => {
                        if (value === 1 && onRemove) {
                            onRemove();
                        } else if (value > 0) {
                            handleDecrement();
                        }
                    }}
                    disabled={disabled || (value === 0) || (value <= 1 && !onRemove)}
                >
                    {value === 1 && onRemove ? (
                        <i className="fa-solid fa-trash-can text-danger"></i>
                    ) : (
                        "-"
                    )}
                </Button>
                <span className="fw-bold mx-2">{value}</span>

                <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip}
                    show={showMaxError}
                >
                    <div className="d-inline-block"> {/* Wrapper for disabled button tooltip trigger */}
                        <Button
                            variant="link"
                            size="sm"
                            className={`text-decoration-none fw-bold px-3 ${value >= max ? 'text-muted' : 'text-dark'}`}
                            onClick={handleIncrement}
                            disabled={disabled}
                            style={{ cursor: value >= max ? 'not-allowed' : 'pointer' }}
                        >
                            +
                        </Button>
                    </div>
                </OverlayTrigger>
            </div>
            {showMaxError && (
                <small className="text-danger ms-2 fw-bold position-absolute" style={{ width: 'max-content', left: '100%', top: '50%', transform: 'translateY(-50%)' }}>
                    Max Qty
                </small>
            )}
        </div>
    );
};

export default QuantitySelector;
