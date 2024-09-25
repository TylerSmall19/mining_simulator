import { Request, Response } from 'express';
import { IndexHandler } from '../IndexHandler';

describe.skip('Index Handler', () => {
  it('calls response.send', () => {
    const mockSend = jest.fn();
    // @ts-ignore
    const mockResponse = { statusCode: 0, send: mockSend } as Response;
    expect(mockSend).not.toHaveBeenCalled();
    IndexHandler({} as Request, mockResponse);
    expect(mockSend).toHaveBeenCalled();
  });

  it('sends a 200 code', () => {
    const mockSend = jest.fn();
    // @ts-ignore
    const mockResponse = { statusCode: 0, send: mockSend } as Response;
    expect(mockResponse.statusCode).not.toBe(200);
    IndexHandler({} as Request, mockResponse);
    expect(mockResponse.statusCode).toBe(200);
  });
});