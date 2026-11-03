<?php

namespace App\Exceptions;

use Exception;

class ResourceNotFoundException extends Exception
{
    public function __construct(string $message = 'Registro não encontrado')
    {
        parent::__construct($message);
    }
}
