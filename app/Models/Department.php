<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'Departments'; // Set the table name
    protected $primaryKey = 'Department_ID'; // Set the primary key if different from id
    public $timestamps = false; // Set to true if your table has timestamps

    // Define fillable properties for mass assignment
    protected $fillable = [
        'Department_ID',
        'Dept_Name',
        'Tax_ID',
        'Dept_Upper_HALO',
        'Dept_Lower_HALO',
        'Dept_Preset',
        'Dept_KeyNumber',
        'Dept_KeyLabel',
        'Dept_Unit',
    ];

    // Define any relationships if needed
    public function departmentHistories()
    {
        return $this->hasMany(DepartmentHistory::class, 'Department_ID', 'Department_ID');
    }

    // You can add other methods as needed for your application logic
}
