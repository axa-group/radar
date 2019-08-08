import {
  Action,
  Alert,
  Button,
  Loader,
  MultiSelectInput,
  PassInput,
  SelectInput,
  TextareaInput,
  TextInput,
} from '@axa-fr/react-toolkit-all';
import React from 'react';

import { IFormFields } from '../types';
import { EnhancedUrlsMultiInput } from '../UrlsMultiInput/UrlsMultiInput.container';

import './Form.scss';

export const Form = ({
  error,
  disableSubmit,
  fields,
  hasSubmit,
  loading,
  onChange,
  onSubmit,
  onMultiUrlsAdd,
  onMultiUrlsRemove
} : {
  error: string,
  disableSubmit: boolean,
  fields: IFormFields,
  hasSubmit: boolean,
  loading: boolean,
  onChange: (...args: any[]) => any,
  onSubmit: (...args: any[]) => any,
  onMultiUrlsAdd?: (...args: any[]) => any,
  onMultiUrlsRemove?: (...args: any[]) => any
}) => (
  <div className="af-form radar-form">
    <form name="myform">
      {error && <Alert classModifier="error" title={error} />}
      <article className="af-panel af-radar-panel">
        <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
          <section className="af-panel__content radar-form__content">
          {Object.keys(fields).map((key, index) => {
            const commonProps = {
              onChange,
              autoFocus: index === 0,
              id: key,
              key: `${key}-field`,
              label: fields[key].label,
              message: fields[key].message,
              messageType: 'error',
              name: fields[key].name,
              classNameContainerLabel: 'col-md-3 offset-md-1',
              classNameContainerInput: 'col-md-8',
              forceDisplayMessage: hasSubmit,
              disabled: fields[key].disabled
            };
            switch (fields[key].type) {
              case 'text':
                return (
                  <TextInput
                    {...commonProps}
                    classNameContainerInput={'col-md-8 radar-form__input-text'}
                    value={fields[key].value}
                  />
                );
              case 'textarea':
                return (
                  <TextareaInput
                    {...commonProps}
                    classNameContainerInput={'col-md-8 radar-form__input-textarea'}
                    value={fields[key].value ? fields[key].value : '' }
                  />
                );
              case 'select':
                return (fields[key].options && (
                  <SelectInput
                    {...commonProps}
                    classNameContainerInput={'col-md-8 radar-form__input-select'}
                    options={fields[key].options}
                    value={fields[key].value}
                  />
                ));
              case 'multi-select':
                return (fields[key].options && (
                  <MultiSelectInput
                    {...commonProps}
                    classNameContainerInput={'col-md-8 radar-form__input-multi-select'}
                    options={fields[key].options}
                    values={fields[key].values}
                  />
                ));
              case 'pass':
                return (
                  <PassInput
                    {...commonProps}
                    classNameContainerInput={'col-md-8 radar-form__input-pass'}
                    value={fields[key].value}
                  />
                );
              case 'multi-urls-inputs':
                return (
                  <div className="row af-form__group af-form__group--label-top" key={`${key}-field`}>
                    <div className="col-md-3 af-form__group-label offset-md-1">{fields[key].label}</div>
                    <div className="col-md-7">
                    {fields[key].values && fields[key].values.map((value, valuesIndex) => (
                      <div key={`${key}-${valuesIndex}`} 
                        className="radar-form__multi-urls">
                        <EnhancedUrlsMultiInput
                          id={key}
                          index={valuesIndex}
                          values={fields[key].values}
                          value={value}
                          onChange={onChange}
                        />
                        <Action
                          id="id"
                          classModifier="multi-urls-remove"
                          icon="remove"
                          title="Remove"
                          onClick={() => onMultiUrlsRemove(fields[key].values, valuesIndex)}
                        />
                      </div>
                    ))}
                    </div>
                    <div className="col-md-1 offset-md-10 af-form__group-multi-urls-add">
                      <Action
                        id="id"
                        classModifier="multi-urls-add"
                        icon="plus"
                        title="Add"
                        onClick={() => onMultiUrlsAdd(fields[key].values)}
                      />
                    </div>
                  </div>
                );
              default:
                break;
            }
          })}
            <div className="row">
              <div className="col-md-8 offset-md-4">
                <Button
                  classModifier={`hasiconRight confirm ${disableSubmit && 'disabled'}`}
                  id="myForm"
                  disabled={disableSubmit}
                  onClick={onSubmit}>
                  <span className="af-btn-text">Valider</span>
                  <i className="glyphicon glyphicon-arrowthin-right" />
                </Button>
              </div>
            </div>
          </section>
        </Loader>
      </article>
    </form>
  </div>
);
