# Code Hygiene Guide

This document outlines the code hygiene principles and debugging practices for maintaining high-quality, maintainable code.

## Core Principles

### 1. Research Before Implementation
- **Always look things up online** even if you think you know the solution
- Document findings in the research journal
- Verify compatibility and best practices before coding
- Check multiple sources for critical decisions

### 2. Comprehensive Testing
- Write tests as you develop, not after
- Run tests after every significant change
- Test edge cases and error conditions
- Include performance tests for critical operations

### 3. Systematic Debugging Approach
- **Critical Rule**: If something is broken and multiple fix attempts fail, **audit ALL the code**, not just the specific file
- Check dependencies and load order
- Verify assumptions about data flow
- Look for side effects in seemingly unrelated code

### 4. Clean Code Structure
- Use meaningful variable and function names
- Keep functions small and focused on single responsibilities
- Comment complex logic and business rules
- Maintain consistent code formatting

### 5. Dependency Management
- Minimize external dependencies
- Understand the dependency chain
- Load scripts in correct order
- Handle missing dependencies gracefully

## Debugging Methodology

### When Something Breaks:

#### Step 1: Initial Assessment
- [ ] Identify the exact error message and location
- [ ] Check browser console for all errors, not just the first one
- [ ] Verify the issue is reproducible

#### Step 2: Quick Fixes (Max 2 attempts)
- [ ] Try obvious solutions based on error message
- [ ] Check for typos and syntax errors
- [ ] Verify recent changes didn't introduce the issue

#### Step 3: Comprehensive Audit (If quick fixes fail)
- [ ] **Review ALL related files**, not just the failing one
- [ ] Check script loading order and dependencies
- [ ] Verify data flow from start to finish
- [ ] Look for timing issues and race conditions
- [ ] Check for conflicting CSS or JavaScript
- [ ] Validate HTML structure and accessibility

#### Step 4: Systematic Testing
- [ ] Create minimal reproduction case
- [ ] Test in different browsers
- [ ] Check with different data sets
- [ ] Verify error handling paths

#### Step 5: Documentation
- [ ] Document the root cause in changelog
- [ ] Update tests to prevent regression
- [ ] Add comments explaining the fix

## File Organization Standards

### Directory Structure
	project/
	├── css/           # Stylesheets
	├── js/            # JavaScript modules
	├── tests/         # Test files
	├── docs/          # Documentation
	├── assets/        # Images, fonts, etc.
	└── index.html     # Entry point

### Naming Conventions
- **Files**: kebab-case (`note-manager.js`)
- **Classes**: PascalCase (`NotesManager`)
- **Functions**: camelCase (`createNewNote`)
- **Constants**: UPPER\_SNAKE\_CASE (`MAX_NOTES_COUNT`)
- **CSS Classes**: kebab-case (`note-item`)

## Code Quality Checklist

### Before Committing Changes:
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Code follows naming conventions
- [ ] Functions are properly documented
- [ ] Error handling is implemented
- [ ] Performance impact is acceptable
- [ ] Accessibility requirements are met
- [ ] Browser compatibility is maintained

### JavaScript Standards
- Use ES5 syntax for IE11+ compatibility
- Implement proper error handling with try/catch
- Avoid global variables, use module patterns
- Handle asynchronous operations properly
- Validate input parameters
- Provide meaningful error messages

### CSS Standards
- Use CSS custom properties with fallbacks
- Implement progressive enhancement
- Provide high contrast and reduced motion support
- Use semantic class names
- Optimize for performance (avoid expensive selectors)

### HTML Standards
- Use semantic HTML elements
- Provide proper ARIA labels
- Implement keyboard navigation
- Include skip links for accessibility
- Validate markup structure

## Performance Guidelines

### JavaScript Performance
- Debounce expensive operations (search, auto-save)
- Use efficient DOM manipulation techniques
- Avoid memory leaks with proper cleanup
- Implement lazy loading for large datasets
- Cache frequently accessed elements

### CSS Performance
- Use efficient selectors
- Minimize repaints and reflows
- Leverage hardware acceleration where appropriate
- Optimize font loading
- Use CSS containment for isolated components

### Storage Performance
- Use appropriate IndexedDB indexes
- Batch database operations
- Implement proper transaction management
- Handle storage quota gracefully
- Optimize data serialization

## Error Handling Standards

### Categories of Errors
1. **User Errors**: Invalid input, quota exceeded
2. **System Errors**: Storage failure, network issues
3. **Programming Errors**: Logic bugs, type errors
4. **Browser Errors**: Compatibility issues, missing features

### Error Response Strategy
- **User Errors**: Show helpful toast messages
- **System Errors**: Provide fallback options
- **Programming Errors**: Log details, show generic message
- **Browser Errors**: Graceful degradation

### Error Logging
- Log errors to console with context
- Include stack traces for debugging
- Track error patterns for improvement
- Never expose sensitive information

## Testing Standards

### Test Categories
- **Unit Tests**: Individual functions and classes
- **Integration Tests**: Component interactions
- **Performance Tests**: Speed and memory usage
- **Accessibility Tests**: Keyboard and screen reader support
- **Browser Tests**: Cross-browser compatibility

### Test Quality
- Tests should be independent and repeatable
- Use descriptive test names
- Test both success and failure paths
- Include edge cases and boundary conditions
- Maintain test coverage above 80%

## Documentation Requirements

### Code Documentation
- Document public APIs with JSDoc
- Explain complex algorithms
- Include usage examples
- Document browser compatibility notes

### Project Documentation
- Maintain up-to-date changelog
- Document architecture decisions
- Include setup and deployment instructions
- Provide troubleshooting guides

---

## Emergency Debugging Protocol

When facing a critical issue that's blocking progress:

1. **Stop and Breathe**: Don't rush into more changes
2. **Document Current State**: What works, what doesn't
3. **Full System Audit**: Check every file, dependency, and assumption
4. **Minimal Reproduction**: Strip down to simplest failing case
5. **Research**: Look up similar issues online
6. **Ask for Help**: Sometimes fresh eyes spot what you missed
7. **Document Solution**: Prevent future occurrences

Remember: **It's better to spend 30 minutes on a thorough audit than 3 hours on random fixes.**
