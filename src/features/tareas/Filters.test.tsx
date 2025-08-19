import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';

describe('Filters', () => {
  const colaboradoresMock = ['Juan', 'Pedro'];
  const mockOnApplyFilters = jest.fn();

  beforeEach(() => {
    mockOnApplyFilters.mockClear();
  });

  it('renderiza los campos de filtro correctamente', () => {
    render(<Filters onApplyFilters={mockOnApplyFilters} colaboradoresDisponibles={colaboradoresMock} />);

    expect(screen.getByText('Filtros')).toBeInTheDocument();
    expect(screen.getByText('Prioridad')).toBeInTheDocument();
    expect(screen.getByText('Colaborador')).toBeInTheDocument();
  });

  it('aplica filtros correctamente cuando se seleccionan opciones y se hace click en aplicar', () => {
    render(<Filters onApplyFilters={mockOnApplyFilters} colaboradoresDisponibles={colaboradoresMock} />);

    fireEvent.change(screen.getByDisplayValue('Estado'), { target: { value: 'Completado' } });
    fireEvent.change(screen.getByDisplayValue('Prioridad'), { target: { value: 'Alta' } });
    fireEvent.change(screen.getByDisplayValue('Colaborador'), { target: { value: 'Juan' } });

    fireEvent.click(screen.getByRole('button', { name: /Aplicar Filtros/i }));

    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      estado: 'Completado',
      prioridad: 'Alta',
      colaborador: 'Juan',
    });
  });

  it('limpia los filtros al hacer click en "Limpiar filtros"', () => {
    render(<Filters onApplyFilters={mockOnApplyFilters} colaboradoresDisponibles={colaboradoresMock} />);

    fireEvent.change(screen.getByDisplayValue('Estado'), { target: { value: 'En curso' } });

    fireEvent.click(screen.getByText(/Limpiar filtros/i));

    expect(mockOnApplyFilters).toHaveBeenCalledWith({});
  });
});
