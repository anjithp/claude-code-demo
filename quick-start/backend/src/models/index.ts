/**
 * Centralized model exports and association setup
 */

import { Task, setupAssociations } from './Task';
import { Category, seedCategories } from './Category';

// Setup model associations
setupAssociations();

export { Task, Category, seedCategories };
