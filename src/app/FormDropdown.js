import React from 'react';
import styles from './components.module.css';

const FormDropdown = ({ dropdownInfo }) => {

    const {
        isDropdownOpen,
        setIsDropdownOpen,
        options,
        selectedOption,
        setSelectedOption
    } = dropdownInfo;

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
    };

    return (
        <div>
            <label className={styles.marginTop}>Uploading method:</label>

            <button
                className={`${styles.button} ${styles.flexCenter}`}
                onClick={toggleDropdown}
            >
                {selectedOption || 'Select an option'}
            </button>

            {isDropdownOpen && (
                <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                        {options.map((option, i) => (
                            <li
                                key={i}
                                className={styles.dropdownItem}
                                onClick={() => handleOptionClick(option)}
                            >
                                <span>{option}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FormDropdown;
