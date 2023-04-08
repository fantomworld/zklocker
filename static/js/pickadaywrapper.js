import React, {
    useRef,
    useEffect
} from 'react';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

const PikadayWrapper = ({
    value,
    onChange,
    disabled
}) => {
    const inputRef = useRef();

    useEffect(() => {
        const picker = new Pikaday({
            format: 'dd-mm-yy',
            minDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            field: inputRef.current,
            onSelect: (date) => {
                onChange(date);
            },
        });

        return () => {
            picker.destroy();
        };
    }, [onChange]);

    useEffect(() => {
        if (value) {
            inputRef.current.value = value;
        }
    }, [value]);

    return <input type = "text"
    readOnly = "true"
    ref = {
        inputRef
    }
    disabled = {
        disabled
    }
    />;
};

export default PikadayWrapper;