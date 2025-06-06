import moment from 'moment-timezone';
import axios from 'axios';
import { User } from '../models/User.js';

/**
 * Converts UTC time to user's local time
 * @param {string} utcTime - UTC time string
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Object containing date, time, and timezone
 */
export const convertToUserLocalTime = async (utcTime, userId) => {
    try {
        const user = await User.findOne({ userId });

        if (!user || !user.timezone) {
            throw new Error('User or timezone not found');
        }

        const localTime = moment(utcTime).tz(user.timezone);

        return {
            date: localTime.format('YYYY-MM-DD'),
            time: localTime.format('HH:mm:ss'),
            timezone: user.timezone
        };
    } catch (error) {
        console.error('Error converting time:', error);
        throw error;
    }
};

/**
 * Fetches the user's local currency based on their country
 * @param {string} userId - User's ID
 * @returns {Promise<string>} Currency code
 */
export const getUserLocalCurrency = async (userId) => {
    try {
        const user = await User.findOne({ userId });

        if (!user || !user.country) {
            throw new Error('User or country not found');
        }

        const response = await axios.get(`https://restcountries.com/v3.1/alpha/${user.country}`);

        if (response.data && response.data[0] && response.data[0].currencies) {
            const currencies = Object.keys(response.data[0].currencies);
            return currencies[0]; // Return the first currency code
        } else {
            throw new Error('Currency information not available');
        }
    } catch (error) {
        console.error('Error fetching currency:', error);
        throw error;
    }
};

/**
 * Formats a date and time according to the user's locale
 * @param {Date} date - Date object to format
 * @param {string} userId - User's ID
 * @returns {Promise<string>} Formatted date and time string
 */
export const formatUserLocalDateTime = async (date, userId) => {
    try {
        const user = await User.findOne({ userId });

        if (!user || !user.timezone) {
            throw new Error('User or timezone not found');
        }

        const localTime = moment(date).tz(user.timezone);
        return localTime.format('LLLL'); // Localized date and time format
    } catch (error) {
        console.error('Error formatting date and time:', error);
        throw error;
    }
};