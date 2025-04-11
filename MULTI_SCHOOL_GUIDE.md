# IBMATHS CHOICE Multi-School System Guide

This guide contains detailed instructions on how to use the IBMATHS CHOICE system with support for multiple schools.

## Access Credentials

### Global Administrative Access
- **URL:** Access directly or via the "School Admin" button in the top right corner
- **Username:** admin
- **Password:** ibmaths2025
- **Privileges:** Complete access to all schools and global settings

### School Credentials
Below are the credentials for the 10 schools configured in the system:

| School Name | Access Code | Password |
|-------------|-------------|----------|
| St. Paul's School | STPAULS | IB2025@sp |
| British College | BRITCOL | IB2025@bc |
| American School | AMSCHOOL | IB2025@as |
| St. Francis College | STFRAN | IB2025@sf |
| Swiss-Brazilian School | SUICO | IB2025@es |
| International School | INTSCH | IB2025@is |
| Canadian International School | CANINT | IB2025@ci |
| French International School | FRENCH | IB2025@fi |
| German International School | GERMAN | IB2025@gi |
| Japanese International School | JAPAN | IB2025@ji |
| Beacon School | BEACON | IB2025@bs |

## Access Flow

1. User accesses the IBMATHS CHOICE website
2. Clicks the "School Admin" button in the top right corner
3. Enters the school code and password
4. Is redirected to the school's user login interface
5. Enters their teacher or administrator credentials
6. Accesses the school-specific dashboard

## Features by User Type

### School Administrator
- Complete view of all students in their school
- Generation of reports in PDF, Excel, and CSV formats
- Comparative analysis of results
- Management of teachers and students
- Customization of school colors and logo

### Teacher
- View of students under their responsibility
- Detailed analysis of responses and recommendations
- Generation of PDFs with individual student reports
- Export of data for external analysis

### Student
- Simplified login with school code + individual password
- Interface customized with school colors
- Questionnaire adapted to school needs
- View of results and course recommendations

## Visual Customization System

Each school can have its own visual identity in the system:

1. **Primary and secondary colors:** Define the general appearance of the interface
2. **School logo:** Displayed in the header and reports
3. **Custom messages:** Welcome messages and other text can be customized for each school
4. **Theme integration:** All components automatically adapt to the school's visual identity

## Data Isolation

The multi-school system ensures complete data isolation between schools:

1. **Row-Level Security (RLS):** Database policies ensure that each school can only access its own data
2. **Authentication cascade:** School → User type → Specific user
3. **JWT token system:** Authentication tokens include school ID to enforce isolation
4. **Controlled visibility:** Teachers can only see students from their own school, and students can only access their own questionnaires

## Security Recommendations

For additional security, we recommend:

1. **Regular password rotation:** Change school passwords every 3-6 months
2. **Two-factor authentication:** Consider enabling 2FA for administrator accounts
3. **Access auditing:** Regularly check access logs to monitor system usage
4. **Data backups:** Schedule regular backups of questionnaire data

## How to Add a New School

To add a new school to the system:

1. Access the system with the global administrator account
2. Go to the "Schools" section in the admin dashboard
3. Click "Add New School"
4. Fill in the school details, including name, code, password, and visual customization
5. Save the new school
6. Provide the school code and password to the school administrator

## Support and Troubleshooting

If you encounter any issues with the multi-school system:

1. **Login issues:** Verify the school code and password are correct
2. **Access problems:** Check that the user has the appropriate role (admin, teacher, or student)
3. **Data visibility:** Remember that data isolation is enforced, so users can only see data relevant to their school and role
4. **Technical support:** Contact support@ibmathschoice.com for assistance

This multi-school system provides a secure, isolated environment for each school while maintaining a consistent and intuitive user experience. Each school can customize its appearance while benefiting from the full functionality of the IBMATHS CHOICE platform.
